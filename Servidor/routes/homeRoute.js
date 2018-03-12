const express = require('express')
const casoEsperaController = require('../controllers/casoEsperaController')
const router = express.Router()

router.get('/casosEspera', casoEsperaController.getCasosEspera)

module.exports = router
