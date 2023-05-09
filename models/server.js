const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.path = {
			categorias: '/api/categorias',
			usuarios: '/api/usuarios',
			auth: '/api/auth',
			productos: '/api/productos',
			buscar: '/api/buscar',
		};

		//Conectar DB
		this.conectarDB();
		//Middleware
		this.middlewares();
		//Rutas de la aplciación
		this.routes();
	}

	routes() {
		this.app.use(this.path.auth, require('../routes/auth'));
		this.app.use(this.path.categorias, require('../routes/categorias'));
		this.app.use(this.path.usuarios, require('../routes/usuarios'));
		this.app.use(this.path.productos, require('../routes/productos'));
		this.app.use(this.path.buscar, require('../routes/buscar'));
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
