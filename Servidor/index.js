require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser');
const switcher = require('./switcher')

const loginRoute = require('./routes/loginRoute')
const homeRoute = require('./routes/homeRoute')
const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

app.set('port', process.env.PORT || 8079)

switcher.getMaster()

app.get('/', (req, res) => {
  res.send('Example API HOME PAGE 💩')
})

app.use('/login', loginRoute)
app.use('/home', homeRoute)


app.listen(app.get('port'), err => {
  if (err) return console.log(`something bad happened 💩 ${err}`)
  console.log(`server listening on ${app.get('port')}`)
})



