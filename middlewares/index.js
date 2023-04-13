const validaCampos = require('./validarCampos.js');
const validaRoles = require('./validar-roles.js');
const validaJWT = require('./validar-jwt.js');

module.exports = { ...validaCampos, ...validaRoles, ...validaJWT };
