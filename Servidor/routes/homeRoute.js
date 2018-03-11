const express = require('express')
const homeController = require('../controllers/homeController')
const router = express.Router()

router.put('/props', homeController.upDateProps)
router.post('/post', homeController.createPost)
router.put('/post', homeController.upDatePost)
router.delete('/post', homeController.deletePost)
router.get('/', homeController.getProps)
router.get('/post', homeController.getPosts)

module.exports = router
