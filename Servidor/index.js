require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const homeRoute = require('./routes/homeRoute')
const authRoute = require('./routes/authRoute')
const app = express()



app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(fileUpload());

app.set('port', process.env.PORT || 8079)

mongoose.connect(process.env.DBM || "mongodb://localhost:27017/RedCuido")

app.use('/home', homeRoute)
app.use('/auth', authRoute)

app.listen(app.get('port'), err => {
  if (err) return console.log(`Ha ocurrido un error ${err}`)
  console.log(`server listening on ${app.get('port')}`)
})




