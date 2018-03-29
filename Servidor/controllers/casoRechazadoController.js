const casoRechazadoModel = require('../models/casoRechazadoModel')
const mongoose = require('mongoose')

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


module.exports = {
  getCasosRechazados,createCasoRechazado
}



