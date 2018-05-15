const mongoose = require('mongoose')

const usuarioModel = require('../models/usuarioModel')
const casoVisitaModel = require('../models/casoVisitaModel')
const casoActivoModel = require('../models/casoActivoModel')
const casoRechazadoModel = require('../models/casoRechazadoModel')
const casoExcluidoModel = require('../models/casoExcluidoModel')
const casoEsperaModel = require('../models/casoEsperaModel')

const auth = require('./authController')

var JsSearch = require('js-search');

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('telefono');
busqueda.addIndex('_id');
busqueda.addIndex('location');


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

function getFiltered(req, res) {
  
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , filtro: []})
    return
  }

  result = []
  casoEsperaModel.find().exec((err, espera) => {
      for( i in espera){result.push({...espera[i]._doc,location:"espera"})}
      console.log(result)
      casoVisitaModel.find().exec((err, visita) => {
        for( i in visita){result.push({...visita[i]._doc,location:"visita"})}

        casoActivoModel.find().exec((err, activo) => {
          for( i in activo){result.push({...activo[i]._doc,location:"activos"})}

          casoRechazadoModel.find().exec((err, rechazado) => {
            for( i in rechazado){result.push({...rechazado[i]._doc,location:"rechazados"})}

            casoExcluidoModel.find().exec((err, excluido) => {
              for( i in excluido){result.push({...excluido[i]._doc,location:"excluidos"})}
              
              busqueda.addDocuments(result)

              res.status(200)
              res.json({error:false, filtro:busqueda.search(req.query.filtro)})
            })
          })
        })
      })
    })
}

module.exports = {
  getNotificaciones,cleanNotificaciones,deleteNotificacion,getFiltered
}



