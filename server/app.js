require('dotenv').config()
const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 5000,
    cors = require('cors'),
    services = require('./routes/services')
    passwords = require('./routes/passwords')

//MONGODB SETUP
require('./database')()

app.use(cors())
app.use(express.json())

app.use('/services', services)
app.use('/passwords', passwords)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))