const { Router } = require('express');
const { check } = require('express-validator');
const {
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	borrarProducto,
} = require('../controllers/productos');
const {
	validarCampos,
	validarJWT,
	tieneRole,
	esAdminRole,
} = require('../middlewares');
const {
	existeProductoPorId,
	existeUsuarioPorId,
	existeCategoria,
} = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerProductos);
router.get(
	'/:id',
	[
		check('id', 'No es un id válido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProducto
);
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('categoria', 'No es un id válido').isMongoId(),
		check('categoria').custom(existeCategoria),
		validarCampos,
	],
	crearProducto
);
router.put(
	'/:id',
	[
		validarJWT,
		tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		check('id', 'No es un id válido').isMongoId(),
		check('id', 'el id no es correcto').custom(existeProductoPorId),
		validarCampos,
	],
	actualizarProducto
);
router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id válido').isMongoId(),
		check('id', 'el id no es correcto').custom(existeProductoPorId),
		validarCampos,
	],
	borrarProducto
);

module.exports = router;
