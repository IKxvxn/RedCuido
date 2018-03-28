const express = require('express')
const casoEsperaController = require('../controllers/casoEsperaController')
const casoActivoController = require('../controllers/casoActivoController')
const casoExcluidoController = require('../controllers/casoExcluidoController')
const router = express.Router()


router.get('/', casoEsperaController.getCasosEspera)
router.post('/casoEspera', casoEsperaController.createCasoEspera)

router.get('/casoActivo', casoActivoController.getCasosActivos)
router.post('/casoActivo', casoActivoController.createCasoActivo)

router.get('/casoExcluido', casoExcluidoController.getCasosExcluidos)
router.post('/casoExcluido', casoExcluidoController.createCasoExcluidos)

module.exports = router
