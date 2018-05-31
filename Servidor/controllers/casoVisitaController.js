const casoVisitaModel = require('../models/casoVisitaModel')
const casoActivoModel = require('../models/casoActivoModel')
const casoRechazadoModel = require('../models/casoRechazadoModel')
const usuarioModel = require('../models/usuarioModel')
const Permisos = require('../models/permisos');
const auth = require('./authController')
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const mongoose = require('mongoose')
const path = require('path');

//funcion que obtiene todos los perfiles de visita
function getCasosVisita(req, res) {
  //verifica token y usuario
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  //obtiene todos los visitados
  casoVisitaModel.find().sort({ingreso: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({ error: true })
      }
      res.status(200)
      res.json({ error: false, casos: casos })
    })
}

//funcion que crea un nuevo perfil
function createCasoVisita(req, res) {
  //Toma el caso del body (que viene en form data)
  let usuario = JSON.parse(req.body.usuario);
  //verifica usuario y token
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
  //verifica permisos de usuario
  if(Permisos.ESP_VIS_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }

  let info = JSON.parse(req.body.caso);
  info["files"] = []
  //Crea caso
  let newCaso = new casoVisitaModel(info)
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "visita", action: "create", caso: newCaso._id }
  newCaso.save((err, resp) => {
    if (err) {
      res.status(500)//error
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
            casoVisitaModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(newCaso._id) }, { $set: { "files": archivos } },{new:true})
              .exec((err, caso) => {
                if (err) {
                  res.status(500)//error
                  res.send({ error: false })
                }
                else {
                  res.status(200)//exito
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

//funcion que edita un perfil
function editCasoVisita(req, res) {
  //Toma el caso del body (que viene en form data)
  let usuario = JSON.parse(req.body.usuario);
  //verifica usuario y token
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
  //verifica permisos de usuario
  if(Permisos.ESP_VIS_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  //crea notificacion
  let info = JSON.parse(req.body.caso);
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "visita", action: "update", caso: {} }
  //hace update en BD
  casoVisitaModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(info._id) }, { $set: info}, {new:true})
    .exec((err, caso) => {
      if (err) {
        res.status(500)//error
        res.send({ error: false })
      }
      else {
        //caso["files"] = []
        //Recorre req.files en caso de que se haya subido algo
        notificacion.caso=caso._id
        var files = [];
        var archivos = [];
        console.log(archivos)
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
              //update de archivos
              casoVisitaModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(caso._id) }, { $set: { "files": archivos } },{new:true})
                .exec((err, casod) => {
                  if (err) {
                    res.status(500)
                    res.send({ error: false })
                  }
                  else {
                    res.status(200)
                    res.send({ error: false, caso:casod })
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
        //se agrega notificacion
        usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

//funcion que mueve un caso a lista de activos
function acceptCasoVisita(req, res) {
  let usuario = req.body.usuario;
  //verifica usuario y token
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
  //verifica permisos
  if(Permisos.ESP_VIS_ACEP.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  //elimina perfil de lista visita
  casoVisitaModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
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
      //crea un perfil en lista de activos
      let newCaso = new casoActivoModel({
        _id:new mongoose.Types.ObjectId(req.params.id),cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos,
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono, nacimiento: req.body.caso.nacimiento,
        ingreso: req.body.caso.ingreso, sede: req.body.caso.sede, señas: req.body.caso.señas, riesgo: req.body.caso.riesgo, 
        notas: nota, files: req.body.caso.files, alt_alimentacion: req.body.caso.alt_alimentacion, alt_higiene: req.body.caso.alt_higiene,
        alt_salud: req.body.caso.alt_salud,alt_atencion: req.body.caso.alt_atencion,
        alt_apoyo: req.body.caso.alt_apoyo,alt_equipamento: req.body.caso.alt_equipamento,
        alt_alquiler: req.body.caso.alquiler,alt_familias: req.body.caso.alt_familias,
        alt_asistente: req.body.caso.alt_asistente,alt_institucionalizacion: req.body.caso.alt_institucionalizacion})
      let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "visita", action: "accepted", caso: newCaso._id }
      newCaso.save((err, resp) => {
        if (err) {
          res.status(500)//error
          res.send({ error: true })
        }
        else {
          //agrega notificacion
          usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
        }
      })
      res.status(300)
      res.json(caso)//exito
    })
}

//funcion que pasa el caso a lista de rechazados
function rejectCasoVisita(req, res) {
  let usuario = req.body.usuario;
  //se verifica usuario y token
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
  if(Permisos.ESP_VIS_ACEP.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  //se elimina caso de lista visita
  casoVisitaModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
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
      //console.log(req.body.caso)
      //crea nuevo caso en lista rechazados
      let newCaso = new casoRechazadoModel({
        _id:new mongoose.Types.ObjectId(req.params.id), cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos,
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, señas: req.body.caso.señas, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede, notas: nota,  nacimiento: req.body.caso.nacimiento, ingreso: req.body.caso.ingreso, files: req.body.caso.files 
      })
      //crea notificacion
      let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "visita", action: "rejected", caso: newCaso._id }
      newCaso.save((err, resp) => {
        if (err) {
          res.status(500)//error
          res.send({ error: true })
        }
        else {
          //agrega notificacion
          usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
        }
      })
      res.status(300)
      res.json(caso)//exito
    })
}

//funcion que elimina perfil de lista visita
function deleteCasoVisita(req, res) {
  let usuario = req.body.usuario;
  //verifica perfil y token
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
  //verifica permisos de usuario
  if(Permisos.ESP_VIS_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  //elimina perfil de lista visita
  casoVisitaModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"visita",action:"delete", caso:req.id}
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

//funcion que hace descargar los archivos de perfil
function download(req,res){
  //busca el perfil en BD
  casoVisitaModel.find({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .exec((err, caso) => {
      if (err) {
        res.status(500)//error
        res.send(`Ocurrió un error 💩 ${err}`)
      }
      var zipFiles = []
      //agrego files a la lista con formato path y name
      for (file of caso[0].files){
        zipFiles[zipFiles.length] =  { path: `../Servidor/uploads/${file}`, name: `${file}` }
      }
      res.zip({ files: zipFiles, filename: 'adjuntos.zip'}) //envia el zip a cliente
    })
}

//exporta funciones
module.exports = {
  getCasosVisita, createCasoVisita, editCasoVisita, acceptCasoVisita, rejectCasoVisita, deleteCasoVisita, download
}



