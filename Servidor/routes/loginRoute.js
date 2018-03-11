const express = require('express')
const loginController = require('../controllers/loginController')
const router = express.Router()

router.post('/signUp', loginController.signUp)
router.post('/signIn', loginController.signIn)

module.exports = router
