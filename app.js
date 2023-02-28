const dotenv = require('dotenv');

dotenv.config();

const Server = require('./models/server');

const server = new Server();

server.listen();
