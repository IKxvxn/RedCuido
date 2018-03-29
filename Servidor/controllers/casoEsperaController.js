const casoEsperaModel = require('../models/casoEsperaModel')
const casoActivoModel = require('../models/casoActivoModel')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');

const mongoose = require('mongoose')

function getCasosEspera(req, res) {
  casoEsperaModel.find()
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, casos: casos})
    })
}

function createCasoEspera(req,res){
  let newCaso = new casoEsperaModel(req.body)
  let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"espera",action:"create", caseId:newCaso._id}
  newCaso.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
    else{
    usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
    }
  })
  res.status(200)
  res.send({error:false, caso:newCaso})
}

function editCasoEspera(req, res) {
  let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"espera",action:"update",caseId:req.body._id}
  casoEsperaModel.updateOne({_id: new mongoose.Types.ObjectId(req.body._id)},{ returnNewDocument : true }, {$set: req.body})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({error:false})
      }
      else{
        res.status(200)
        res.send({error:false,caso:{...req.body,ingreso:new Date(req.body.ingreso)}})
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

function acceptCasoEspera(req, res) {
  casoEsperaModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoActivoModel({cedula: req.body.cedula, apellidos: req.body.apellidos, 
        nombre: req.body.nombre, domicilio: req.body.domicilio, telefono: req.body.telefono,
        sede: req.body.sede, señas: req.body.señas})
      let notificacion = {autor:"kevin",_id:uuidv4(),fecha:new Date(),location:"espera",action:"accepted", caseId:newCaso._id}
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
  getCasosEspera,createCasoEspera,editCasoEspera,acceptCasoEspera
}



