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

function cleanNotificaciones(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true})
    return
  }
  usuarioModel.findByIdAndUpdate({_id: req.query.usuario}, {$set: {notificaciones:[]}})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:true})
      }
      else{
        res.status(200)
        res.send({error:false})
      }
    })
}

function deleteNotificacion(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true})
    return
  }
  usuarioModel.findByIdAndUpdate({_id: req.query.usuario}, {$pull:{ 'notificaciones': { _id: req.query.notificacion } } })
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:true})
      }
      else{
        res.status(200)
        res.send({error:false})
      }
    })
}

module.exports = {
  getNotificaciones,cleanNotificaciones,deleteNotificacion
}



