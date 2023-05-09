const { response } = require('express');
const { Categoria, Producto } = require('../models/index');

const obtenerProductos = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;

	const query = { estado: true };

	const [productos, total] = await Promise.all([
		Producto.find(query)
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre')
			//Yo lo había investigado así
			// .populate({
			// 	path: 'usuario',
			// 	select: 'nombre , correo -_id',
			// })
			.skip(desde)
			.limit(limite),

		Producto.countDocuments(query),
	]);

	res.status(200).json({ productos, total });
};

const obtenerProducto = async (req, res = response) => {
	const { id } = req.params;

	const producto = await Producto.findById(id)
		.populate('usuario', 'nombre')
		.populate('categoria', 'nombre');
	res.json({ producto });
};

const crearProducto = async (req, res = response) => {
	const { estado, usuario, nombre, ...resto } = req.body;
	const nombreUpper = nombre.toUpperCase();

	const productoDB = await Producto.findOne({ nombre: nombreUpper });

	//Se verifica si el producto	existe

	if (productoDB) {
		return res
			.status(400)
			.json({ msg: `El producto ${productoDB.nombre} ya existe` });
	}

	const data = {
		nombre: nombreUpper,
		usuario: req.usuario.id,
		...resto,
	};

	//Se crea el producto

	const producto = await new Producto(data);

	//Se almacena el producto en la DB

	producto.save();

	res.status(201).json(producto);
};

const actualizarProducto = async (req, res = response) => {
	const { id } = req.params;
	const { usuario, estado, ...data } = req.body;

	if (data.nombre) {
		data.nombre = data.nombre.toUpperCase();
	}
	data.usuario = req.usuario._id;

	const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

	res.status(200).json({ msg: 'todo ok', producto });
};

const borrarProducto = async (req, res = response) => {
	const { id } = req.params;

	const productoBorrado = await Producto.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);

	res.status(200).json({ msg: 'todo ok', productoBorrado });
};
module.exports = {
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	borrarProducto,
};
