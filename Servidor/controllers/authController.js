const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel')


function crearUsuario(req, res) {
  let newUsuario = new usuarioModel({...req.body,contraseña:bcrypt.hashSync(req.body.contraseña, 8)})
  
  newUsuario.save((err, resp) => {
    if(err){
      res.status(500)
      res.send({error:true})
    }
  })
  res.status(200)
  res.send({error:false, caso:newUsuario})
}

function ingresar(req, res) {

  //...

}

module.exports = {
  crearUsuario, ingresar
}



