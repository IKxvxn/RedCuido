const casoEsperaModel = require('../models/casoEsperaModel')
const casoActivoModel = require('../models/casoActivoModel')
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
  newCaso.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
  })
  res.status(200)
  res.send({error:false, caso:newCaso})
}

function editCasoEspera(req, res) {
  console.log(req.body)
  console.log(req.params)
  Company.updateOne({_id: ObjectId(req.params.id)}, {
     $set: req.body
   })
    .exec((err, company) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      res.status(300)
      res.json({error:false, caso:req.body})
    })
}

function acceptCaso(req,res){
  let newCaso = new casoEsperaModel(req.body)

  casoEsperaModel.findOne({ _id: req.body._id }, function(err, result) {

    let activo = new casoActivoModel(result)
    /* you could set a new id
    swap._id = mongoose.Types.ObjectId()
    swap.isNew = true
    */

    result.remove()
    activo.save((err, resp) => {
      if(err){
        res.status(500)
        res.send({error:true})
      }
      else{
        res.status(200)
        res.send({error:false})
      }
    })


  })


}

module.exports = {
  getCasosEspera,createCasoEspera,acceptCaso,editCasoEspera
}



