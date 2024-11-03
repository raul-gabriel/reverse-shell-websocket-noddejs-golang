

/*const configuracion = {
  urlServidor: 'ws://localhost:4000/',
  urlApi:'http://localhost:4000/api/',
  SECRET_KEY:'ANONYMOUS'
};
export default configuracion;

/*
const baseUrl = window.location.origin;
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'; 

const configuracion = {
  urlServidor: `${wsProtocol}://${window.location.host}/`,
  urlApi: `${baseUrl}/api/`,
  SECRET_KEY: 'ANONYMOUS'
};

export default configuracion;*/



const baseUrl = window.location.origin;
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'; 

const configuracion = process.env.NODE_ENV === 'development'
  ? {
      urlServidor: 'ws://localhost:5000/',
      urlApi: 'http://localhost:5000/api/',
      SECRET_KEY: 'ANONYMOUS'
    }
  : {
      urlServidor: `${wsProtocol}://${window.location.host}/`,
      urlApi: `${baseUrl}/api/`,
      SECRET_KEY: 'ANONYMOUS'
    };

export default configuracion;
