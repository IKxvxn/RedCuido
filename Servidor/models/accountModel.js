const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
  _id: { type: String, required: true },
  password: { type: String, required: true },
  dbName: { type: String, required: true }
})

const user = mongoose.model("user", accountSchema)
module.exports = user
