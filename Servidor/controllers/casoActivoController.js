const casoActivoModel = require('../models/casoActivoModel')
const mongoose = require('mongoose')

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

module.exports = {
  getCasosActivos,createCasoActivo
}



