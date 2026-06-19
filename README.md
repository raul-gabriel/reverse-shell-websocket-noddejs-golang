# Reverse Shell Educativa - Primera Versión

## Descripción

Este proyecto es una prueba de concepto desarrollada con fines educativos y de investigación en ciberseguridad. Fue creado para comprender el funcionamiento de arquitecturas cliente-servidor, comunicación en tiempo real mediante WebSockets, transferencia de archivos y administración remota de sistemas.

> **Aviso:** Este proyecto fue desarrollado únicamente con fines académicos y de aprendizaje. No debe utilizarse en sistemas o redes sin autorización explícita del propietario.

## Arquitectura del Proyecto

```text
/
├── servidor/
├── interfaz_cliente/
├── cliente/
└── ExcelExploit/
```

### servidor/

Servidor principal desarrollado con Node.js y Express.

Responsabilidades:

* Gestión de conexiones WebSocket.
* Administración de clientes conectados.
* Recepción y envío de comandos.
* Transferencia de archivos.
* Coordinación de la comunicación entre operadores y clientes.

### interfaz_cliente/

Interfaz web desarrollada con React + Vite.

Características:

* Visualización de clientes conectados.
* Administración de sesiones activas.
* Ejecución remota de comandos.
* Gestión de archivos.
* Visualización de capturas de pantalla recibidas.

### cliente/

Cliente desarrollado en Go (Golang).

Funciones:

* Conexión persistente al servidor mediante WebSocket.
* Recepción y ejecución de instrucciones remotas.
* Envío de información solicitada por el servidor.
* Transferencia de archivos.
* Captura y envío de pantallas.

### ExcelExploit/

Documento Excel que contiene macros utilizadas para pruebas de laboratorio y demostraciones académicas.

Su propósito es simular escenarios de ejecución automática dentro de entornos controlados para estudiar vectores comunes utilizados en ejercicios de seguridad informática.

## Tecnologías Utilizadas

### Backend

* Node.js
* Express
* WebSocket

### Frontend

* React
* Vite

### Cliente

* Golang

### Otros

* Microsoft Excel VBA (Macros)

## Características Implementadas

* Comunicación en tiempo real mediante WebSocket.
* Administración de múltiples clientes.
* Ejecución remota de comandos.
* Transferencia de archivos.
* Captura de pantalla remota.
* Panel web de administración.
* Arquitectura cliente-servidor.

## Estado del Proyecto

Esta es la primera versión funcional del proyecto.

Actualmente implementa las características básicas necesarias para demostrar la comunicación remota entre cliente y servidor.

Algunas funcionalidades planeadas para futuras versiones incluyen:

* Mejoras en la estabilidad de conexión.
* Optimización del protocolo de comunicación.
* ejecucion de codigo en memoria
* Bypass.
* tecnicas sofisticas del 2026.
* explotacion de nuevas vulnerabilidades en windows y apps.
* version para android
* servidor c2
* y otros

Debido a actividades académicas y laborales, el desarrollo se encuentra actualmente pausado.

## Video de Demostración

Puedes agregar aquí el enlace al video:

```text
[https://youtube.com/PEGAR_AQUI_EL_ENLACE
](https://www.youtube.com/watch?v=LsA0BP-JBuY)```

## Descargo de Responsabilidad

El autor no se hace responsable del uso indebido de este software. El proyecto fue creado exclusivamente con fines educativos, de investigación y aprendizaje en entornos autorizados y controlados.
