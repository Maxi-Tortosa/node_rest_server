const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.usuariosPath = '/api/usuarios';
		this.authPath = '/api/auth';

		//Conectar DB
		this.conectarDB();
		//Middleware
		this.middlewares();
		//Rutas de la aplciación
		this.routes();
	}

	routes() {
		this.app.use(this.authPath, require('../routes/auth'));
		this.app.use(this.usuariosPath, require('../routes/usuarios'));
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		//CORS
		this.app.use(cors());

		//Lectura y parseo del body
		this.app.use(express.json());

		//Directorio público
		this.app.use(express.static('public'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`App ejecutándose en el puerto: ${this.port} `);
		});
	}
}

module.exports = Server;
