require('dotenv').config();
const http = require('http'); //commande pour importer le packager de Node
//ici on importe note appli
const app = require('./app');

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '4000');
const hostname = process.env.HOSTNAME || '127.0.0.1';
app.set('port', port);
  
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};  

const server = http.createServer((req, res) => { //on lui pass app
  console.log(process.env.BASE_URL);
  app(req, res);
});

// prend en argument la fonction qui sera appelé à chaque requete reçu par le serveur
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port, hostname, () => {
  console.log(`Server listening on http://${hostname}:${port}`);
});