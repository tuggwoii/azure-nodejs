'use strict';
var express = require('express');
var app = express();
var Connection = require('tedious').Connection;
var bodyParser = require('body-parser');
var api = require('./sv/api');
app.set('port', (process.env.PORT || 8000));
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
app.use(bodyParser.json());
app.use('/api/v1', api);

app.get('/', function (req, res) {
	res.status(200).render('index.html');
});

app.listen(app.get('port'), function () {
    console.log('App is running on port ' + app.get('port'));
});
 