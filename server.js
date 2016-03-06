'use strict';
var express = require('express');
var Connection = require('tedious').Connection;
var dbconfig = require('./sv/connection');
var app = express();
app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/libs', express.static(__dirname + '/node_modules'));
app.use('/css', express.static(__dirname + '/src/static/css'));
app.use('/js', express.static(__dirname + '/src/static/js'));
app.use('/img', express.static(__dirname + '/src/static/img'));
app.use('/favicon.ico', express.static(__dirname + '/src/static/img/favicon.ico'));
app.use('/fonts', express.static(__dirname + '/src/static/fonts'));
app.use('/resources', express.static(__dirname + '/src/static/resources'));

app.get('/', function (req, res) {
	res.status(200).render('index.html');
});

var sql = require('node-sqlserver');
var conn_str = "Driver={SQL Server Native Client 11.0};Server=tcp:tuggdevdb.database.windows.net,1433;Database=devdb;Uid=tugg@tuggdevdb;Pwd={Pass1234};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;";

app.listen(app.get('port'), function () {
	console.log('App is running on port ' + app.get('port'));
	sql.query(conn_str, "SELECT * FROM TestTable", function (err, results) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        for (var i = 0; i < results.length; i++) {
            res.write("ID: " + results[i].ID + " Column1: " + results[i].Column1 + " Column2: " + results[i].Column2);
        }
        res.end("; Done.");
    });
});