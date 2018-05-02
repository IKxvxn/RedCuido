const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const auth = require('./authController')

function getNotificaciones(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , notificaciones: []})
    return
  }
  usuarioModel.find({_id:req.query.usuario})
    .exec((err, usuario) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, notificaciones:usuario[0].notificaciones.reverse()})
    })
}

module.exports = {
  getNotificaciones
}



