const casoRechazadoModel = require('../models/casoRechazadoModel')
const casoEsperaModel = require('../models/casoEsperaModel')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

function getCasosRechazados(req, res) {
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
  let newCaso = new casoRechazadoModel(req.body)
  newCaso.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
  })
  res.status(200)
  res.send({error:false, caso:newCaso})
}

function reactivateCasoRechazado(req, res) {
  casoRechazadoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
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

function editCasoRechazado(req, res) {
  let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"rechazado",action:"update",caseId:req.body._id}
  casoRechazadoModel.updateOne({_id: new mongoose.Types.ObjectId(req.body._id)}, {$set: req.body})
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


module.exports = {
  getCasosRechazados,createCasoRechazado,editCasoRechazado,reactivateCasoRechazado
}



