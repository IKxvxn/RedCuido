const casoActivoModel = require('../models/casoActivoModel')
const casoExcluidoModel = require('../models/casoExcluidoModel')
const auth = require('./authController')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

function getCasosActivos(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  casoActivoModel.find().sort({ingreso: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, casos: casos})
    })
}

function createCasoActivo(req,res){
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
  let newCaso = new casoActivoModel(req.body.caso)
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "activo", action: "create", caso: newCaso._id }
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

function editCasoActivo(req, res) {
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

  let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"activo",action:"update",caso:{}}
  
  casoActivoModel.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(req.body.caso._id)}, {$set: req.body.caso},{new:true})
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

function excludeCasoActivo(req, res) {
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
  casoActivoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      //Configura nota con nota anterior
      var nota = req.body.caso.notas;
      if (nota === undefined){
        nota = req.body.nota
      }
      else{
        nota = nota+"\n"+req.body.nota
      }
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoExcluidoModel({cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        _id: new mongoose.Types.ObjectId(req.params.id),nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, señas: req.body.caso.señas, telefono: req.body.caso.telefono,
        ingreso: req.body.caso.ingreso, inicio: req.body.caso.inicio, altv_aprobadas: req.body.caso.alternativas, nacimiento: req.body.caso.nacimiento,
        sede: req.body.caso.sede, notas:nota, nacimiento: req.body.caso.nacimiento,  files: req.body.caso.files  })
      
        let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"activo",action:"excluded", caso:newCaso._id}
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

function deleteCasoActivo(req, res) {
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

  casoActivoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"activo",action:"delete", caso:req.id}
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
  getCasosActivos,createCasoActivo,editCasoActivo, excludeCasoActivo, deleteCasoActivo
}



