const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config')
const usuarioModel = require('../models/usuarioModel')



function ingresar(req, res) {
  var usuario = req.body
  usuarioModel.findById(usuario.usuario).then((user)=>{
      if(!user){res.status(500);res.send({error:true, type:0})}
      else if(bcrypt.compareSync(usuario.contraseña,user.contraseña)){
        res.status(200);res.send({error:false,usuario:{usuario:usuario.usuario,tipo:user.tipo,token:jwt.sign({ id: usuario.usuario }, config.pass, {expiresIn: 86400})}});
      }
      else{res.status(500);res.send({error:true, type:1})}
    }).catch(error => {
      console.log(error)
    })

}

function autentificarAccion(JWT) {
  return jwt.verify(JWT, config.pass);
}

module.exports = {
  ingresar, autentificarAccion 
}



