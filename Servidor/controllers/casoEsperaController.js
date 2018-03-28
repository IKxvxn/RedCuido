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
  casoEsperaModel.updateOne({_id: new mongoose.Types.ObjectId(req.params.id)}, {
     $set: {cedula: req.body.cedula, apellidos: req.body.apellidos, 
      nombre: req.body.nombre, domicilio: req.body.domicilio, telefono: req.body.telefono,
      problemas: req.body.problemas, sede: req.body.sede, prioridad: req.body.prioridad, 
      notas: req.body.notas, señas: req.body.señas}
   })
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      res.status(300)
      res.json({_id: new mongoose.Types.ObjectId(req.params.id), cedula: req.body.cedula, apellidos: req.body.apellidos, 
        nombre: req.body.nombre, domicilio: req.body.domicilio, telefono: req.body.telefono,
        ingreso: new Date(req.body.ingreso), problemas: req.body.problemas, sede: req.body.sede, 
        prioridad: req.body.prioridad, notas: req.body.notas, señas: req.body.señas })
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
      newCaso.save((err, resp) => {
        if(err){
          res.status(500)
          res.send({error:true})
        }
      })
      res.status(300)
      res.json(caso)
    })
}

module.exports = {
  getCasosEspera,createCasoEspera,editCasoEspera,acceptCasoEspera
}



