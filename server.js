const express = require("express");

const auth_router = require('./routes/auth.js')

var app = express();


app.use('/api/auth/', auth_router)
 
app.listen(4000)