const casoRechazadoModel = require('../models/casoRechazadoModel')
const casoEsperaModel = require('../models/casoEsperaModel')
const auth = require('./authController')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

function getCasosRechazados(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  casoRechazadoModel.find()
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, casos: casos})
    })
}

function createCasoRechazado(req,res){

  let usuario = req.body.usuario;

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }

  let newCaso = new casoRechazadoModel(req.body.caso)
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "rechazado", action: "create", caso: newCaso._id }
  newCaso.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
    else{
      res.status(200)
      res.send({error:false, caso:newCaso})
      usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
    }
  })
  
}

function reactivateCasoRechazado(req, res) {
  let usuario = req.body.usuario;

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }
  casoRechazadoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoEsperaModel({_id: new mongoose.Types.ObjectId(req.params.id),cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede, señas: req.body.caso.señas, notas:req.body.caso.notas})
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"rechazado",action:"reactivate", caseId:newCaso._id}
      newCaso.save((err, resp) => {
        if(err){
          res.status(500)
          res.send({error:true})
        }
        else{
          usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
        }
      })
      res.status(300)
      res.json(caso)
    })
}

function editCasoRechazado(req, res) {
  let usuario = req.body.usuario;

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }

  let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"rechazado",action:"update",caso:{}}
  
  casoRechazadoModel.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(req.body.caso._id)}, {$set: req.body.caso}, {new:true})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:true})
      }
      else{
        res.status(200)
        res.send({error:false,caso:caso})
        notificacion.caso=caso._id
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
    })
}


module.exports = {
  getCasosRechazados,createCasoRechazado,editCasoRechazado,reactivateCasoRechazado
}



