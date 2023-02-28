const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array()); // con el método .array() se convierte el objeto directamente
	}

	next();
};

module.exports = { validarCampos };
