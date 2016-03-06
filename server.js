'use strict';
var express = require('express');
var app = express();
var models = require('./sv/models');
var shortid = require('shortid');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
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

function serealizer (data) {
    data['id'] = data['null'];
    var json = JSON.stringify(data);
    return JSON.stringify(data);
}

function serealizerList(collection) {
    return JSON.stringify(collection);
}

function responseObject (res, object) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(serealizer(object));
}

function responseList(res, collection) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(serealizerList(collection));
}

function responseMessage (res, message) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).send( JSON.stringify({
        error: {
            message: message
        }
    }));
}

function responseError (res, error) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).send(JSON.stringify({
        error: {
            message: error
        }
    }));
}

app.get('/', function (req, res) {
	res.status(200).render('index.html');
});


//USERS
app.get('/users/:id', function (req, res) {
    models.User.findById(req.params.id, {
        include: [
        { model: models.Role}
        ]
    }).then(function (model) {
        responseObject(res, model);
    }).catch(function (err) {
        responseError(res, err.message);
    });
});

app.get('/users', function (req, res) {
    models.User.all().then(function (projects) {
        responseList(res, projects);
    }).catch(function (err) {
        responseError(res, err.message);
    });
});

app.post('/users', function (req, res) {
    if (req.body.username && req.body.password && req.body.email) {
        var user = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            email: req.body.email,
            user_role: 14,
            sid: shortid.generate()
        };
        models.User.create(user, { isNewRecord: true })
        .then(function (model) {
            responseObject(res, model);
        }).catch(function (err) {
            responseError(res, err.message);
        });
    }
    else {
        responseMessage(res, 'Username/password/email is required');
    }
});

//ROLES
app.get('/roles', function (req, res) {
    models.Role.all().then(function (projects) {
        responseList(res, projects);
    }).catch(function (err) {
        responseError(res, err.message);
    });
});

app.post('/roles', function (req, res) {
    if (req.body.name) {
        var role = {
            name: req.body.name,
            sid: shortid.generate()
        };
        models.Role.create(role, { isNewRecord: true })
        .then(function (model) {
            responseObject(res, model);
        }).catch(function (err) {
            responseError(res, err.message);
        });
    }
    else {
        responseMessage(res, 'Name is required');
    }
});


app.listen(app.get('port'), function () {
    console.log(models);
    console.log('App is running on port ' + app.get('port'));
});
