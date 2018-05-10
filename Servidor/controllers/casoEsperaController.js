const casoEsperaModel = require('../models/casoEsperaModel')
const casoVisitaModel = require('../models/casoVisitaModel')
const casoRechazadoModel = require('../models/casoRechazadoModel')
const usuarioModel = require('../models/usuarioModel')
const auth = require('./authController')
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const mongoose = require('mongoose')
const path = require('path');


function getCasosEspera(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  casoEsperaModel.find().sort({ingreso: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({ error: true })
      }
      res.status(200)
      res.json({ error: false, casos: casos })
    })
}

function createCasoEspera(req, res) {
  //Toma el caso del body (que viene en form data)
  
  let usuario = JSON.parse(req.body.usuario);

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }

  let info = JSON.parse(req.body.caso);
  info["files"] = []
  //Crea caso
  let newCaso = new casoEsperaModel(info)
  
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "espera", action: "create", caso: newCaso._id }
  newCaso.save((err, resp) => {
    
    if (err) {
      res.status(500)
      res.send({ error: true, type: 2 })
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
            casoEsperaModel.updateOne({ _id: new mongoose.Types.ObjectId(newCaso._id) }, { $set: { "files": archivos } })
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

function editCasoEspera(req, res) {
  //Toma el caso del body (que viene en form data)
  let usuario = JSON.parse(req.body.usuario);

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }
  
  let info = JSON.parse(req.body.caso);

  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "espera", action: "update", caso: {} }
  
  casoEsperaModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(info._id) }, { $set: info},{new:true})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({ error: false })
      }
      else {
        caso["files"] = []
        notificacion.caso = caso._id
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
          res.send({error:false, caso:caso})
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
              casoEsperaModel.updateOne({ _id: new mongoose.Types.ObjectId(caso._id) }, { $set: { "files": archivos } })
                .exec((err, casod) => {
                  if (err) {
                    res.status(500)
                    res.send({ error: false })
                  }
                  else {
                    res.status(200)
                    res.send({ error: false, caso: { ...caso, ingreso: new Date(caso.ingreso), files: archivos } })
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

function acceptCasoEspera(req, res) {
  let usuario = req.body.usuario;

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }
  casoEsperaModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .exec((err, caso) => {
      var nota = req.body.caso.notas;
      if (nota === undefined){
        nota = req.body.nota
      }
      else{
        nota = nota+"\n"+req.body.nota
      }
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoVisitaModel({
        _id:new mongoose.Types.ObjectId(req.params.id),cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, problemas: req.body.caso.problemas,
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono, ingreso: req.body.caso.ingreso,
        sede: req.body.caso.sede, señas: req.body.caso.señas, notas: nota, prioridad: req.body.caso.prioridad, files: req.body.caso.files,
      })
      let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "espera", action: "accepted", caso: newCaso._id }
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

function rejectCasoEspera(req, res) {
  let usuario = req.body.usuario;

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }

  casoEsperaModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .exec((err, caso) => {
      //Configura nota con nota anterior
      var nota = req.body.caso.notas;
      if (nota === undefined){
        nota = req.body.nota
      }
      else{
        nota = nota+"\n"+req.body.nota
      }
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoRechazadoModel({
        _id: new mongoose.Types.ObjectId(req.params.id),cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, ingreso: req.body.caso.ingreso,
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, señas: req.body.caso.señas, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede, notas: nota })
      let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "espera", action: "rejected", caso: newCaso._id }
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


function download(req,res){
  /*console.log("------------------------------")
  console.log(__dirname)
  res.download('../servidor/uploads/026fbf374e2dbf4a-algoritmo.JPG','026fbf374e2dbf4a-algoritmo.JPG');*/
  casoEsperaModel.find({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      var zipFiles = []
      //agrego files a la lista con formato path y name
      for (file of caso[0].files){
        zipFiles[zipFiles.length] =  { path: `../Servidor/uploads/${file}`, name: `${file}` }
      }
      res.zip({ files: zipFiles, filename: 'adjuntos.zip'})
    })
}


function deleteCasoEspera(req, res) {
  let usuario = req.body.usuario;

  if(usuario.token===undefined){
    res.status(500)
    res.send({ error: true , type: 0})
    return
  }

  if(!auth.autentificarAccion(usuario.token)){
    res.status(500)
    res.send({ error: true , type: 1})
    return
  }

  casoEsperaModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"espera",action:"delete", caso:req.id}
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }else{
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
        res.status(300)
        res.json(caso)
      }
    })
}

module.exports = {
  getCasosEspera, createCasoEspera, editCasoEspera, acceptCasoEspera, rejectCasoEspera,download, deleteCasoEspera
}


