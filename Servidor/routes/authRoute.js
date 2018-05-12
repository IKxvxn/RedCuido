const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

//router.post('/crearUsuario', authController.crearUsuario)
router.post('/ingresar', authController.ingresar)

module.exports = router