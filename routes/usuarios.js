const { Router } = require('express');
const { check } = require('express-validator');

const {
	esRoleValido,
	emailExiste,
	existeUsuarioPorId,
} = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validarCampos');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles.js');
// const { validarJWT } = require('../middlewares/validar-jwt');

const {
	validarCampos,
	validarJWT,
	tieneRole,
	esAdminRole,
} = require('../middlewares/index');

const {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);
router.put(
	'/:id',
	[
		check('id', 'No es un id válido').isMongoId(),
		check('id', 'No existe un usuario con este id').custom(existeUsuarioPorId),
		check('rol').custom(esRoleValido),

		validarCampos,
	],
	usuariosPut
);
router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password debe contener más de 6 caracteres')
			.isLength({ min: 6 })
			.not()
			.isEmpty(),
		check('correo', 'El correo no es válido').isEmail(),
		check('correo').custom(emailExiste),
		// check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('rol').custom(esRoleValido),
		validarCampos,
	],
	usuariosPost
);
router.patch('/', usuariosPatch);
router.delete(
	'/:id',
	[
		validarJWT,
		// esAdminRole,
		tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		check('id', 'No es un id válido').isMongoId(),
		check('id', 'No existe un usuario con este id').custom(existeUsuarioPorId),
		validarCampos,
	],
	usuariosDelete
);

module.exports = router;
