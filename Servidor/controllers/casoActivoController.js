const casoActivoModel = require('../models/casoActivoModel')
const casoExcluidoModel = require('../models/casoExcluidoModel')
const auth = require('./authController')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');
const path = require('path');
const crypto = require('crypto');
const Permisos = require('../models/permisos');


function getCasosActivos(req, res) {
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  casoActivoModel.find().sort({inicio: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, casos: casos})
    })
}


function createCasoActivo(req, res) {
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

  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }

  let info = JSON.parse(req.body.caso);
  info["files"] = []
  //Crea caso
  let newCaso = new casoActivoModel(info)
  
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "activo", action: "create", caso: newCaso._id }
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
            casoActivoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(newCaso._id) }, { $set: { "files": archivos } },{new:true})
              .exec((err, caso) => {
                if (err) {
                  res.status(500)
                  res.send({ error: false })
                }
                else {
                  res.status(200)
                  res.send({ error: false, caso: caso })
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

function download(req,res){
  casoActivoModel.find({ _id: new mongoose.Types.ObjectId(req.params.id) })
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

function editCasoActivo(req, res) {
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

  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  
  let info = JSON.parse(req.body.caso);

  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "activo", action: "update", caso: {} }
  
  casoActivoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(info._id)},{ $set: info},{new:true})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send({ error: false })
      }
      else {
        //caso["files"] = []
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
                archivos = caso.files.concat(archivos)
              }
              casoActivoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(caso._id)}, {$set: { "files": archivos } },{new:true})
                .exec((err, casod) => {
                  if (err) {
                    res.status(500)
                    res.send({ error: false })
                  }
                  else {
                    res.status(200)
                    res.send({ error: false, caso: casod})
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

function excludeCasoActivo(req, res) {
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

  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  casoActivoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      //Configura nota con nota anterior
      var nota = req.body.caso.notas;
      if (nota === undefined){
        if (req.body.nota !== ""){
          nota = req.body.nota 
        }
        else{
          nota = ""
        }
      }
      else{
        if (req.body.nota !== ""){
          nota = nota+"\n"+req.body.nota 
        }
      }
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      let newCaso = new casoExcluidoModel({cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        _id: new mongoose.Types.ObjectId(req.params.id),nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, señas: req.body.caso.señas, telefono: req.body.caso.telefono,
        ingreso: req.body.caso.ingreso, inicio: req.body.caso.inicio,
        sede: req.body.caso.sede, notas:nota, nacimiento: req.body.caso.nacimiento,  files: req.body.caso.files,
        alt_alimentacion: req.body.caso.alt_alimentacion, alt_higiene: req.body.caso.alt_higiene,
        alt_salud: req.body.caso.alt_salud,alt_atencion: req.body.caso.alt_atencion,
        alt_apoyo: req.body.caso.alt_apoyo,alt_equipamento: req.body.caso.alt_equipamento,
        alt_alquiler: req.body.caso.alquiler,alt_familias: req.body.caso.alt_familias,
        alt_asistente: req.body.caso.alt_asistente,alt_institucionalizacion: req.body.caso.alt_institucionalizacion})
      
        let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"activo",action:"excluded", caso:newCaso._id}
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

function deleteCasoActivo(req, res) {
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

  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }

  casoActivoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"activo",action:"delete", caso:req.id}
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
  getCasosActivos,createCasoActivo,editCasoActivo, excludeCasoActivo, deleteCasoActivo, download
}



