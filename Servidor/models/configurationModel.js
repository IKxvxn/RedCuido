const mongoose = require('mongoose')

const configurationSchema = mongoose.Schema({
  _id: { type: String, required: true, default: "config" },
  pageName: { type: String, default: "myPage" },
  barBackgroundColor: { type: String, default: "#263238" },
  barEmphasize: { type: String, default: "#036cab" },
  barTextColor: { type: String, default: "#F5F5F5" },
})

const configuration = mongoose.model("configuration", configurationSchema)
module.exports = configuration
