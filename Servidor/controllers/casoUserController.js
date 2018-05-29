const auth = require('./authController')
const mongoose = require('mongoose')
const usuarioModel = require('../models/usuarioModel')
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const path = require('path');
const Permisos = require('../models/permisos');

function getUser(req, res) {
  console.log(req.query)
  if(req.query.token == "undefined" || !auth.autentificarAccion(req.query.token)){
    res.status(100)
    res.json({ error: true , casos: []})
    return
  }
  if(Permisos.usuarios.indexOf(req.query.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  usuarioModel.find().sort({ingreso: -1})
    .exec((err, casos) => {
      if (err) {
        res.status(500)
        res.json({error:true})
      }
      res.status(200)
      res.json({error:false, casos: casos})
    })
}


function createUser(req, res) {
  //Toma el caso del body (que viene en form data)
  let usuario = JSON.parse(req.body.usuario);
  if(usuario.token===undefined){
    res.status(100)
    res.send({ error: true , type: 0})
    return
  }
  if(!auth.autentificarAccion(usuario.token)){
    res.status(100)
    res.send({ error: true , type: 1})
    return
  }
  if(Permisos.usuarios.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }

  let info = JSON.parse(req.body.caso);
  //Crea caso
  let newCaso = new usuarioModel({...info,contraseña:bcrypt.hashSync(info.contraseña, 8), _id:info._id})
  newCaso.save((err, resp) => {
    if (err) {
      res.status(500)
      res.send({ error: true, type: 2 })
    }
    else {
      res.status(200)
      newCaso.contraseña = undefined
      res.send({ error: false, caso: newCaso })
    }
})
}


function editUser(req, res) {
  //Toma el caso del body (que viene en form data)
  let usuario = JSON.parse(req.body.usuario);
  if(usuario.token===undefined){
    res.status(100)
    res.send({ error: true , type: 0})
    return
  }
  if(!auth.autentificarAccion(usuario.token)){
    res.status(100)
    res.send({ error: true , type: 1})
    return
  }
  if(Permisos.usuarios.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  let info = JSON.parse(req.body.caso);
  if(info.contraseña!=undefined){
    info.contraseña=bcrypt.hashSync(info.contraseña, 8)
  }
  usuarioModel.findOneAndUpdate({ _id: info._id},{ $set: info},{new:true})
    .exec((err, casod) => {
      if (err) {
        res.status(500)
        res.send({ error: false })
      }
      else {
        res.status(200)
        casod.contraseña = undefined
        res.send({ error: false, caso: casod})
      }
    })
  }

function deleteUser(req, res) {
  let usuario = req.body.usuario;
  if(usuario.token===undefined){
    res.status(100)
    res.send({ error: true , type: 0})
    return
  }
  if(!auth.autentificarAccion(usuario.token)){
    res.status(100)
    res.send({ error: true , type: 1})
    return
  }
  if(Permisos.usuarios.indexOf(usuario.tipo)<0){
    res.status(100)
    res.send({ error: true , type: 2})
    return
  }
  usuarioModel.deleteOne({_id: req.params.id})
    .exec((err, caso) => {
      if (err) {
        res.status(500)
        res.send(`Ocurrió un error 💩 ${err}`)
      }else{
        res.status(300)
        res.json(caso)
      }
    })
}

module.exports = {
  getUser, editUser, deleteUser, createUser
}



