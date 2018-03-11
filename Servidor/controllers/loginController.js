const configurationModel = require('../models/configurationModel')
const accountModel = require('../models/accountModel')
const switcher = require('../switcher')
const mongoose =require('mongoose');
const bcrypt = require('bcrypt');

function signUp(req, res) {
  var item = req.body
      switcher.getMaster().then(()=>{
        let newUser = new accountModel({
        _id: item._id,
        password: bcrypt.hashSync(item.password, 10),
        dbName: "CMS"+item.dbName
      })
      newUser.save((err, resp) => {
        if(err){
          res.status(500)
          res.send({exist:true})
        }
        setUpUserDB(newUser.dbName).then(()=>{res.status(200);res.json(newUser)})
      })
  })
}


function signIn(req, res) {
  var item = req.body
      switcher.getMaster().then(()=>{
        accountModel.findById(item._id).then((user)=>{
          if(!user){res.status(500);res.send({auth:false})}
          else if(bcrypt.compareSync(item.password,user.password)){
            setUpUserDB(user.dbName).then(()=>{res.status(200);res.send({auth:true,_id:item._id,password:item.password,dbName:user.dbName});})
            
            
          }
          else{res.status(500);res.send({auth:false})}
        })
  })
}

function setUpUserDB(userDB){
  return(switcher.getUser(userDB).then(()=>{let newUserSetUp = new configurationModel()
    newUserSetUp.save()}))
}

module.exports = {
  signUp,signIn
}

