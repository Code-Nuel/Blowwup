const express = require("express");

const auth_router = require('./routes/auth.js')
const general_router = require('./routes/general.js')
var app = express();


app.use('/api/auth/', auth_router)
app.use('/api/', general_router)
 
app.listen(4000)