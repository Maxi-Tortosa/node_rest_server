const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		//Verificar si el email existe
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			return res.status(400).json({ msg: 'El email no es correcto' });
		}
		//Verificar si el usuario está activo

		if (!usuario.estado) {
			return res.status(400).json({ msg: 'El usuario no está activo' });
		}

		//Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({ msg: 'El password no es correcto' });
		}
		//Generar JWT

		const token = await generarJWT(usuario.id);

		res.json({ usuario, token });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Hable con el administrador' });
	}
};

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;
	try {
		const { nombre, correo, img } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			//crear usuario
			const data = {
				nombre,
				correo,
				password: ':P',
				img,
				rol: 'USER_ROLE',
				google: true,
			};

			usuario = new Usuario(data);

			await usuario.save();
		}

		//Verificar si el usuario se encuentra en DB

		if (!usuario.estado) {
			return res
				.status(400)
				.json({ msg: 'Hable con el administrador, usuario bloqueado' });
		}

		//Generar JWT

		const token = await generarJWT(usuario.id);

		res.json({ usuario, token });
	} catch (error) {
		res.status(400).json({ ok: 'false', msg: 'El token no se pudo verificar' });
	}
};

module.exports = { login, googleSignIn };
