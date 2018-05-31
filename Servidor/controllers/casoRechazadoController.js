const casoRechazadoModel = require('../models/casoRechazadoModel')
const casoEsperaModel = require('../models/casoEsperaModel')
const auth = require('./authController')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const path = require('path');
const Permisos = require('../models/permisos');

//funcion que obtiene todos los perfiles de rechazados
function getCasosRechazados(req, res) {
  //verifica token y usuario
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  //pide de la BD todos los perfiles
  casoRechazadoModel.find().sort({rechazo: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})//error
      }
      res.status(200)
      res.json({error:false, casos: casos})//exito
    })
}

//funcion que crea un nuevo perfil
function createCasoRechazado(req, res) {
  //Toma el caso del body (que viene en form data)
  let usuario = JSON.parse(req.body.usuario);
  //verifica el usuario y el token
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
  //verifica que el tipod de usuario tenga el permiso
  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }

  let info = JSON.parse(req.body.caso);
  info["files"] = []
  //Crea caso
  let newCaso = new casoRechazadoModel(info)
  //notifica el cambio realizado
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "rechazado", action: "create", caso: newCaso._id }
  newCaso.save((err, resp) => {
    if (err) {
      res.status(500)
      res.send({ error: true, type: 2 })//error
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
            casoRechazadoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(newCaso._id) }, { $set: { "files": archivos } },{new:true})
              .exec((err, caso) => {
                if (err) {
                  res.status(500)
                  res.send({ error: false })//error
                }
                else {
                  res.status(200)
                  res.send({ error: false, caso: caso })//exito
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
//mueve el caso a lista de espera
function reactivateCasoRechazado(req, res) {
  let usuario = req.body.usuario;
  //verifica token y usuario
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
  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  //elimina usuario de la lista de rechazados
  casoRechazadoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
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
      //crea un nuevo caso en lista de espera
      let newCaso = new casoEsperaModel({_id: new mongoose.Types.ObjectId(req.params.id),cedula: req.body.caso.cedula, apellidos: req.body.caso.apellidos, 
        nombre: req.body.caso.nombre, domicilio: req.body.caso.domicilio, telefono: req.body.caso.telefono,
        sede: req.body.caso.sede,nacimiento:req.body.caso.nacimiento, señas: req.body.caso.señas, notas:nota, files: req.body.caso.files })
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"rechazado",action:"reactivate", caso:newCaso._id}
      newCaso.save((err, resp) => {
        if(err){
          res.status(500)
          res.send({error:true})//error
        }
        else{
          //actualiza notificaciones
          usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
        }
      })
      res.status(300)
      res.json(caso)//exito
    })
}

//funcion que edita un perfil
function editCasoRechazado(req, res) {
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
  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  
  let info = JSON.parse(req.body.caso);
  //crea notificacion
  let notificacion = { autor: usuario.usuario, _id: uuidv4(), fecha: new Date(), location: "rechazado", action: "update", caso: {} }
  //hace update del perfil
  casoRechazadoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(info._id)},{ $set: info},{new:true})
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
              casoRechazadoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(caso._id)}, {$set: { "files": archivos } },{new:true})
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
        //update de notificaciones
        usuarioModel.updateMany({ "$push": { "notificaciones": notificacion } }).exec()
      }
    })
}

//funcion que elimina un perfil
function deleteCasoRechazado(req, res) {
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
  //verifica permisos de usuario
  if(Permisos.LIST_CRUD.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  //elimina el perfil de lista rechazados
  casoRechazadoModel.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec((err, caso) => {
      let notificacion = {autor:usuario.usuario,_id:uuidv4(),fecha:new Date(),location:"rechazado",action:"delete", caso:req.id}
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)//error
      }else{
        //update notificaciones
        usuarioModel.updateMany({"$push": { "notificaciones": notificacion } }).exec()
        res.status(300)
        res.json(caso)//exito
      }
    })
}

//funcion que manda a descargar los archivos del perfil
function download(req,res){
  //busca el perfil en BD
  casoRechazadoModel.find({ _id: new mongoose.Types.ObjectId(req.params.id) })
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
      res.zip({ files: zipFiles, filename: 'adjuntos.zip'}) //envia el zip al cliente
    })
}

//exporta las funciones
module.exports = {
  getCasosRechazados,createCasoRechazado,editCasoRechazado,reactivateCasoRechazado, deleteCasoRechazado, download
}



