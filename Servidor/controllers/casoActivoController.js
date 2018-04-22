const casoActivoModel = require('../models/casoActivoModel')
const casoExcluidoModel = require('../models/casoExcluidoModel')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

function getCasosActivos(req, res) {
  casoActivoModel.find()
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
  let newCaso = new casoActivoModel(req.body)
  newCaso.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
  })
  res.status(200)
  res.send({error:false, caso:newCaso})
}

function editCasoActivo(req, res) {
  let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"activos",action:"update",caseId:req.body._id}
  casoActivoModel.updateOne({_id: new mongoose.Types.ObjectId(req.body._id)}, {$set: req.body})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:false})
      }
      else{
        res.status(200)
        res.send({error:false,caso:{...req.body}})
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

function excludeCasoActivo(req, res) {
  casoActivoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoExcluidoModel({cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, señas: req.body.caso.señas, telefono: req.body.caso.telefono,
        ingreso: req.body.caso.ingreso, inicio: req.body.caso.inicio, altv_aprobadas: req.body.caso.alternativas, nacimiento: req.body.caso.nacimiento,
        sede: req.body.caso.sede, notas:req.body.caso.notas, nacimiento: req.body.caso.nacimiento })
      let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"activo",action:"accepted", caseId:newCaso._id}
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

module.exports = {
  getCasosActivos,createCasoActivo,editCasoActivo, excludeCasoActivo
}



