const { response } = require('express');
const { isValidObjectId } = require('mongoose');
// const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models/index');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

// BÚSQUEDAS

const buscarUsuarios = async (termino = '', res = response) => {
	const esMongoID = isValidObjectId(termino);
	// const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.json({ results: usuario ? [usuario] : [] });
	}

	const regex = new RegExp(termino, 'i');

	const usuariosEncontrados = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	});

	res.json({ results: usuariosEncontrados });
};

const buscarCategorias = async (termino = '', res = response) => {
	const esMongoID = isValidObjectId(termino);
	// const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const categoria = await Categoria.findById(termino);
		return res.json({ results: categoria ? [categoria] : [] });
	}

	const regex = new RegExp(termino, 'i');

	const categoriasEncontradas = await Categoria.find({
		nombre: regex,
		estado: true,
	});

	res.json({ results: categoriasEncontradas });
};

const buscarProductos = async (termino = '', res = response) => {
	const esMongoID = isValidObjectId(termino);
	// const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const producto = await Producto.findById(termino)
			.populate('categoria', 'nombre')
			.populate('usuario', 'nombre');
		return res.json({ results: producto ? [producto] : [] });
	}

	const regex = new RegExp(termino, 'i');

	const productosEncontrados = await Producto.find({
		nombre: regex,
		estado: true,
	})
		.populate('categoria', 'nombre')
		.populate('usuario', 'nombre');

	res.json({ results: productosEncontrados });
};

const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son ${coleccionesPermitidas.join(', ')}`,
		});
	}

	switch (coleccion) {
		case 'usuarios':
			buscarUsuarios(termino, res);
			break;
		case 'categorias':
			buscarCategorias(termino, res);

			break;
		case 'productos':
			buscarProductos(termino, res);

			break;

		default:
			return res.status(500).json({ msg: 'se me olvidó hacer esta búsqueda' });
	}

	// res.json({ msg: 'buscar', coleccion, termino });
};

module.exports = { buscar };
