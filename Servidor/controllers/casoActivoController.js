const casoActivoModel = require('../models/casoActivoModel')
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
        res.send({error:false,caso:{...req.body,ingreso:new Date(req.body.ingreso)}})
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

module.exports = {
  getCasosActivos,createCasoActivo,editCasoActivo
}



