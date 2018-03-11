const mongoose = require('mongoose')

function getMaster(){
  return(mongoose.connection.close().then(()=>mongoose.connect(process.env.DBM)))
}

function getUser(userdb){
  return (mongoose.connection.close().then(()=>mongoose.connect(process.env.DB+userdb)))
}


module.exports = {
  getUser,getMaster
}