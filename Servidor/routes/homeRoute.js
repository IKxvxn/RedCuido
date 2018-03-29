const express = require('express')
const casoEsperaController = require('../controllers/casoEsperaController')
const casoActivoController = require('../controllers/casoActivoController')
const casoExcluidoController = require('../controllers/casoExcluidoController')
const casoRechazadoController = require('../controllers/casoRechazadoController')
const router = express.Router()


router.get('/espera', casoEsperaController.getCasosEspera)
router.post('/espera/casoEspera', casoEsperaController.createCasoEspera)
router.put('/espera/edit/:id', casoEsperaController.editCasoEspera)
router.post('/espera/accept/:id', casoEsperaController.acceptCasoEspera)

router.get('/casoActivo', casoActivoController.getCasosActivos)
router.post('/casoActivo', casoActivoController.createCasoActivo)

router.get('/casoExcluido', casoExcluidoController.getCasosExcluidos)
router.post('/casoExcluido', casoExcluidoController.createCasoExcluidos)


router.get('/casoRechazado', casoRechazadoController.getCasosRechazados)
router.post('/casoRechazado', casoRechazadoController.createCasoRechazado)

module.exports = router
