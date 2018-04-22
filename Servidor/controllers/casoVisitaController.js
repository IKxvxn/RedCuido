const casoVisitaModel = require('../models/casoVisitaModel')
const casoActivoModel = require('../models/casoActivoModel')
const casoRechazadoModel = require('../models/casoRechazadoModel')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const mongoose = require('mongoose')
const path = require('path');

function getCasosVisita(req, res) {
  casoVisitaModel.find()
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({ error: true })
      }
      res.status(200)
      res.json({ error: false, casos: casos })
    })
}

function createCasoVisita(req, res) {
  //Toma el caso del body (que viene en form data)
  console.log(req.body)
  let info = JSON.parse(req.body.caso);
  info["files"] = []
  //Crea caso
  let newCaso = new casoVisitaModel(info)
  let notificacion = { autor: "kevin", _id: uuidv4(), fecha: new Date(), location: "visita", action: "create", caseId: newCaso._id }
  newCaso.save((err, resp) => {
    if (err) {
      res.status(500)
      res.send({ error: true })
    }
    else {
      //Agrega notificacion
      usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
      //Recorre req.files en caso de que se haya subido algo
      var files = [];
      var archivos = [];
      if (req.files != undefined) {
        var fileKeys = Object.keys(req.files);
        fileKeys.forEach(function (key) {
          files.push(req.files[key]);
        });
      }else{
        res.status(200)
        res.send({error:false, caso:newCaso})
      }
      var i = 0;
      while (i < files.length) {
        let file = files[i];
        //Genera random bytes por si hay archivos con mismo nombre
        crypto.randomBytes(8, (err, buf) => {
          if (err) {
            console.log(err);
          }
          var filename = buf.toString('hex') + '-' + file.name
          //Va guardando nombres de archivos para asignarselos al caso.  
          archivos[archivos.length] = filename;
          //Si ya se leyeron todos los files, se le asignan al caso
          if (archivos.length == files.length) {
            casoVisitaModel.updateOne({ _id: new mongoose.Types.ObjectId(newCaso._id) }, { $set: { "files": archivos } })
              .exec((err, caso) => {
                if (err) {
                  res.status(500)
                  res.send({ error: false })
                }
                else {
                  newCaso.set('files', archivos)
                  res.status(200)
                  res.send({ error: false, caso: newCaso })
                }
              })
          }
          // Se usa mv() method para mover el archivo a la carpeta uploads dentro del servidor.
          file.mv(`../Servidor/uploads/${filename}`, function (err) {
            if (err)
              console.log('File not uploaded!')
            console.log('File uploaded!')
          });

        });
        i++;
      }
    }
  })
}

function editCasoVisita(req, res) {
  //Toma el caso del body (que viene en form data)
  let info = JSON.parse(req.body.caso);
  let notificacion = { autor: "kevin", _id: uuidv4(), fecha: new Date(), location: "visita", action: "update", caseId: info._id }
  casoVisitaModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(info._id) }, { $set: info})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({ error: false })
      }
      else {
        info["files"] = []
        //Recorre req.files en caso de que se haya subido algo
        var files = [];
        var archivos = [];
        if (req.files != undefined) {
          var fileKeys = Object.keys(req.files);
          fileKeys.forEach(function (key) {
            files.push(req.files[key]);
          });
        }else{
          res.status(200)
          res.send({error:false, caso:info})
        }
        var i = 0;
        while (i < files.length) {
          let file = files[i];
          //Genera random bytes por si hay archivos con mismo nombre
          crypto.randomBytes(8, (err, buf) => {
            if (err) {
              console.log(err);
            }
            var filename = buf.toString('hex') + '-' + file.name
            //Va guardando nombres de archivos para asignarselos al caso.  
            archivos[archivos.length] = filename;

            //Si ya se leyeron todos los files, se le asignan al caso
            if (archivos.length == files.length) {
              if(caso.files.length>0){
                archivos = [caso.files, archivos]
              }
              casoVisitaModel.updateOne({ _id: new mongoose.Types.ObjectId(info._id) }, { $set: { "files": archivos } })
                .exec((err, casod) => {
                  if (err) {
                    res.status(500)
                    res.send({ error: false })
                  }
                  else {
                    res.status(200)
                    res.send({ error: false, caso: { ...info, ingreso: new Date(info.ingreso), files: archivos } })
                  }
                })
            }
            // Se usa mv() method para mover el archivo a la carpeta uploads dentro del servidor.
            file.mv(`../Servidor/uploads/${filename}`, function (err) {
              if (err)
                console.log('File not uploaded!')
              console.log('File uploaded!')
            });

          });
          i++;
        }
        usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

function acceptCasoVisita(req, res) {
  console.log(req.body.caso)
  casoVisitaModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoActivoModel({
        cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, alternativas: req.body.caso.alternativas,
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono, nacimiento: req.body.caso.nacimiento,
        ingreso: req.body.caso.ingreso, sede: req.body.caso.sede, señas: req.body.caso.señas, riesgo: req.body.caso.riesgo, notas: req.body.caso.notas
      })
      let notificacion = { autor: "kevin", _id: uuidv4(), fecha: new Date(), location: "visita", action: "accepted", caseId: newCaso._id }
      newCaso.save((err, resp) => {
        if (err) {
          res.status(500)
          res.send({ error: true })
        }
        else {
          usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
        }
      })
      res.status(300)
      res.json(caso)
    })
}

function rejectCasoVisita(req, res) {
  casoVisitaModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoRechazadoModel({
        cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos,
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, señas: req.body.caso.señas, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede, notas: req.body.caso.notas,  nacimiento: req.body.caso.nacimiento, ingreso: req.body.caso.ingreso, 
      })
      let notificacion = { autor: "kevin", _id: uuidv4(), fecha: new Date(), location: "visita", action: "rejected", caseId: newCaso._id }
      newCaso.save((err, resp) => {
        if (err) {
          res.status(500)
          res.send({ error: true })
        }
        else {
          usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
        }
      })
      res.status(300)
      res.json(caso)
    })
}

module.exports = {
  getCasosVisita, createCasoVisita, editCasoVisita, acceptCasoVisita, rejectCasoVisita
}



