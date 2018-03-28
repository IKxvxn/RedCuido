const casoExcluidoModel = require('../models/casoExcluidoModel')
const mongoose = require('mongoose')

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


module.exports = {
  getCasosExcluidos,createCasoExcluidos
}



