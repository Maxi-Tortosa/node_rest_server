const { response } = require('express');
const { Categoria, Usuario } = require('../models');

//obtener categorias - paginado - total - populate (obtener dato del usuario que creó la cat), método de moongose

const obtenerCategorias = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [categorias, total] = await Promise.all([
		Categoria.find(query)
			.populate('usuario', 'nombre')
			// .populate({
			// 	path: 'usuario',
			// 	select: 'nombre , correo -_id',
			// })
			.skip(desde)
			.limit(limite),

		Categoria.countDocuments(query),
	]);
	return res.status(201).json({ total, categorias });
};

//obtener categoría - populate {}

const obtenerCategoriaById = async (req, res = response) => {
	const { id } = req.params;

	const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

	// .populate({
	// 	path: 'usuario',
	// 	select: 'nombre , correo -_id',
	// });

	res.json({ categoria });
};

const crearCategoria = async (req, res = response) => {
	const nombre = req.body.nombre.toUpperCase();
	const categoriaDB = await Categoria.findOne({ nombre });

	if (categoriaDB) {
		return res
			.status(400)
			.json({ msg: `La categoria ${categoriaDB.nombre} ya existe` });
	}

	const data = { nombre, usuario: req.usuario._id };

	//Crear categoría
	const categoria = await new Categoria(data);

	//guardar en DB
	categoria.save();

	res.status(201).json(categoria);
};

//actualizar categoría - por nombre - podría generar validación de si cuando estoy actualizando existe el nombre

const actualizarCategoria = async (req, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body;

	data.nombre = data.nombre.toUpperCase();
	data.usuario = req.usuario._id;

	const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

	res.status(200).json({ msg: 'todo ok', categoria });
};

//borrar categoría: cambiar de estado

const borrarCategoria = async (req, res = response) => {
	const { id } = req.params;
	const categoria = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);

	res.status(200).json({ msg: 'todo ok', categoria });
};

module.exports = {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoriaById,
	actualizarCategoria,
	borrarCategoria,
};
