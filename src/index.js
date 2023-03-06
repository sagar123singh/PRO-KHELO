const express = require('express');
require("dotenv").config()
const connectDatabase=require("./config/db")
const bodyParser = require('body-parser');                       
const route = require('./routes/route');
const app = express();                                                               

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDatabase()

app.use('/', route);


app.listen(process.env.PORT , function () {
    console.log('Express app running on port ' + (process.env.PORT))
});;