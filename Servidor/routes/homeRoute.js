const express = require('express')
const casoEsperaController = require('../controllers/casoEsperaController')
const casoActivoController = require('../controllers/casoActivoController')
const router = express.Router()


router.get('/', casoEsperaController.getCasosEspera)
router.post('/casoEspera', casoEsperaController.createCasoEspera)
router.put('/edit/:id', casoEsperaController.editCasoEspera)
router.post('/aceptarCaso/:id', casoEsperaController.acceptCaso)

router.get('/casoActivo', casoActivoController.getCasosActivos)
router.post('/casoActivo', casoActivoController.createCasoActivo)


module.exports = router
