const casoExcluidoModel = require('../models/casoExcluidoModel')
const casoEsperaModel = require('../models/casoEsperaModel')
const auth = require('./authController')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

function getCasosExcluidos(req, res) {
  /*if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }*/
  casoExcluidoModel.find().sort({ingreso: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, casos: casos})
    })
}

function createCasoExcluidos(req,res){

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

  let newCaso = new casoExcluidoModel(req.body.caso)
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "excluido", action: "create", caso: newCaso._id }
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

function reactivateCasoExcluido(req, res) {
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

  casoExcluidoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoEsperaModel({_id: new mongoose.Types.ObjectId(req.params.id),cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede, señas: req.body.caso.señas, notas:req.body.caso.notas})
      
        let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"excluido",action:"reactivate", caso:{}}
      newCaso.save((err, resp) => {
        if(err){
          res.status(500)
          res.send({error:true})
        }
        else{
          notificacion.caso = newCaso._id
          usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
          res.status(300)
          res.json(caso)
        }
      })
      
    })
}

function editCasoExcluido(req, res) {
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
  
  let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"excluido",action:"update",caso:{}}
  casoExcluidoModel.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(req.body.caso._id)}, {$set: req.body.caso}, {new:true})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:true})
      }
      else{
        res.status(200)
        res.send({error:false,caso:caso})
        notificacion.caso = caso._id
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

function deleteCasoExcluido(req, res) {
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

  casoExcluidoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"excluido",action:"delete", caso:req.id}
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }else{
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
        res.status(300)
        res.json(caso)
      }
      
    })
}


module.exports = {
  getCasosExcluidos,createCasoExcluidos,editCasoExcluido,reactivateCasoExcluido, deleteCasoExcluido
}



