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
router.post('/espera/reject/:id', casoEsperaController.rejectCasoEspera)

router.get('/activos', casoActivoController.getCasosActivos)
router.put('/activos/edit/:id', casoActivoController.editCasoActivo)
router.post('/casoActivo', casoActivoController.createCasoActivo)
router.post('/activos/exclude/:id', casoActivoController.excludeCasoActivo)

router.get('/casoExcluido', casoExcluidoController.getCasosExcluidos)
router.post('/casoExcluido', casoExcluidoController.createCasoExcluidos)
router.put('/excluido/edit/:id', casoExcluidoController.editCasoExcluido)
router.post('/excluido/reactivate/:id', casoExcluidoController.reactivateCasoExcluido)


router.get('/casoRechazado', casoRechazadoController.getCasosRechazados)
router.post('/casoRechazado', casoRechazadoController.createCasoRechazado)
router.put('/rechazado/edit/:id', casoRechazadoController.editCasoRechazado)
router.post('/rechazado/reactivate/:id', casoRechazadoController.reactivateCasoRechazado)

module.exports = router
