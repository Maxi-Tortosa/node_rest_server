const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { findByIdAndUpdate } = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };
	// const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;
	// const usuarios = await Usuario.find(query)
	// 	.skip(Number(desde))
	// 	.limit(Number(limite));

	// const total = await Usuario.countDocuments(query);
	// res.json({ msg: 'get Api - controlador', q, nombre, apikey, page, limit });

	const [usuarios, total] =
		//respuesta
		await Promise.all([
			Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
			Usuario.countDocuments(query),
		]);

	res.json({
		// respuesta,
		total,
		usuarios,
	});
};

const usuariosPost = async (req, res = response) => {
	const { nombre, correo, password, rol } = req.body;
	const usuario = new Usuario({ nombre, correo, password, rol });

	//Verificar si el correo existe
	// const existeEmail = await Usuario.findOne({ correo });
	// if (existeEmail) {
	// 	return res.status(400).json({ msg: 'El correo ya está registrado' });
	// }

	//Encriptar contraseña
	const salt = bcryptjs.genSaltSync();
	usuario.password = bcryptjs.hashSync(password, salt);

	//Grabar en dB

	await usuario.save();

	res.json({ usuario });
};

const usuariosPut = async (req, res = response) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	//Validar password contra base de datos
	if (password) {
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);
	res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
	res.json({ msg: 'patch Api - controlador' });
};

const usuariosDelete = async (req, res = response) => {
	const { id } = req.params;

	//Borrar físicamente
	// const usuario = await Usuario.findByIdAndDelete(id);

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

	res.json({
		usuario,
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosDelete,
	usuariosPatch,
};
