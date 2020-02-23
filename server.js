var express = require('express'); //import express 
var app = express();
const bodyParser = require('body-parser');
const buildingrouter = require('./route/apiroute');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
    next();
});

//to handle HTTP get request
app.get('/', function (req, res) {
    res.status(200).json("Hello! Welcome to Building Calculation API!")
});

app.use('/api', buildingrouter);




//start server on port: 8080
var server = app.listen(8080, function () {

    var host = server.address().address;
    var host1 = server.address();
    console.log(host1);
    var port = server.address().port;

    console.log("server listening at http://%s:%s", host, port);
});

module.exports = app;