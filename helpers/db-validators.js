// const Role = require('../models/role');
// const Usuario = require('../models/usuario');
// const Categoria = require('../models/categoria');

const { Role, Categoria, Usuario, Producto } = require('../models/index.js');

const esRoleValido = async (rol = '') => {
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no está registrado en la DB`);
	}
};

const emailExiste = async (correo = '') => {
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(`El correo ${correo} ya está registrado`);
	}
};

const existeUsuarioPorId = async (id) => {
	const existeUsuario = await Usuario.findById(id);
	if (!existeUsuario) {
		throw new Error(`El id: ${id} no existe`);
	}
};

const existeCategoria = async (id) => {
	const existeCategoria = await Categoria.findById(id);

	if (!existeCategoria) {
		throw new Error(`El id: ${id} no existe`);
	}
};

const existeProductoPorId = async (id) => {
	const existeProducto = await Producto.findById(id);

	if (!existeProducto) {
		throw new Error(`El id: ${id} no existe`);
	}
};

module.exports = {
	esRoleValido,
	emailExiste,
	existeUsuarioPorId,
	existeCategoria,
	existeProductoPorId,
};
