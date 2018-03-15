const express = require('express')
const casoEsperaController = require('../controllers/casoEsperaController')
const router = express.Router()

router.get('/casoEspera', casoEsperaController.getCasosEspera)
router.post('/casoEspera', casoEsperaController.createCasoEspera)

module.exports = router
