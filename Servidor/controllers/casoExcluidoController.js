const casoExcluidoModel = require('../models/casoExcluidoModel')
const casoEsperaModel = require('../models/casoEsperaModel')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

function getCasosExcluidos(req, res) {
  casoExcluidoModel.find()
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
  let newCaso = new casoExcluidoModel(req.body)
  newCaso.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
  })
  res.status(200)
  res.send({error:false, caso:newCaso})
}

function reactivateCasoExcluido(req, res) {
  casoExcluidoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoEsperaModel({cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede, señas: req.body.caso.señas, notas:req.body.caso.notas})
      let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"excluido",action:"reactivate", caseId:newCaso._id}
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

function editCasoExcluido(req, res) {
  let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"excluido",action:"update",caseId:req.body._id}
  casoExcluidoModel.updateOne({_id: new mongoose.Types.ObjectId(req.body._id)}, {$set: req.body})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:false})
      }
      else{
        res.status(200)
        res.send({error:false,caso:req.body})
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

function deleteCasoExcluido(req, res) {
  casoExcluidoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"excluido",action:"delete", caseId:req.id}
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }else{
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
      res.status(300)
      res.json(caso)
    })
}


module.exports = {
  getCasosExcluidos,createCasoExcluidos,editCasoExcluido,reactivateCasoExcluido, deleteCasoExcluido
}



