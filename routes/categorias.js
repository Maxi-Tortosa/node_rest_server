const { Router } = require('express');
const { check } = require('express-validator');
const { existeCategoria } = require('../helpers/db-validators');
const {
	validarCampos,
	validarJWT,
	tieneRole,
	esAdminRole,
} = require('../middlewares/index');
const {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoriaById,
	actualizarCategoria,
	borrarCategoria,
} = require('../controllers/categorias');
const router = Router();

//Obtener todas las categorías - público
router.get('/', obtenerCategorias);

//Obtener categoría por id - público
router.get(
	'/:id',
	[
		check('id', 'No es un id válido').isMongoId(),
		check('id').custom(existeCategoria),
		validarCampos,
	],
	obtenerCategoriaById
);

//Crear categoría - privado - cualquier persona con un token válido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		validarCampos,
	],
	crearCategoria
);

//Actualizar categoría - privado - cualquier persona con un token válido

router.put(
	'/:id',
	[
		validarJWT,
		tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		check('id', 'No es un id válido').isMongoId(),
		check('id', 'el id no es correcto').custom(existeCategoria),
		check('nombre', 'El nombre no debe estar vacío').notEmpty(),
		validarCampos,
	],
	actualizarCategoria
);
//Borrar categoría - privado - cualquier persona con un token válido

router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id válido').isMongoId(),
		check('id', 'El id no es correcto').custom(existeCategoria),
		validarCampos,
	],
	borrarCategoria
);

module.exports = router;
