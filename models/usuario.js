const { Schema, model } = require('mongoose');

const UsuariosSchema = Schema({
	nombre: { type: String, required: [true, 'El nombre es requerido'] },
	correo: {
		type: String,
		required: [true, 'El correo es requerido'],
		unique: true,
	},
	password: { type: String, required: [true, 'El password es requerido'] },
	img: { type: String },
	rol: { type: String, required: true, emun: ['ADMIN_ROLE', 'USER_ROLE'] },
	estado: { type: Boolean, default: true },
	google: { type: Boolean, default: false },
});

UsuariosSchema.methods.toJSON = function () {
	const { __v, password, _id, ...usuario } = this.toObject();
	//otra forma: usuario.uid = _id

	return { uid: _id, ...usuario };
};

module.exports = model('Usuario', UsuariosSchema);
