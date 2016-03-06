var models = require('./models');
var shortid = require('shortid');
var bcrypt = require('bcrypt-nodejs');
var User = require('./users');
var authorize = require('./auth');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
module.exports = function () {
    var express = require('express');
    var app = express();

    function serealizer(data) {
        data['id'] = data['null'];
        var json = JSON.stringify(data);
        return JSON.stringify(data);
    }

    function serealizerList(collection) {
        return JSON.stringify(collection);
    }

    function responseObject(res, object) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(serealizer(object));
    }

    function responseList(res, collection) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(serealizerList(collection));
    }

    function responseMessage(res, message) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({
            error: {
                message: message
            }
        }));
    }

    function responseError(res, error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
            error: {
                message: error
            }
        }));
    }

    function responsePermission(res) {
        res.status(401).json({
            error: {
                message: 'permission denied.'
            }
        });
    }

    //ACCOUNTS
    app.post('/login', function (req, res) {
        var data = req.body;
        User.isValidLogin(data).then(function (user) {
            authorize.authorizeUser(user).then(function (token) {
                user.token = token;
                responseObject(res, user);
            }).catch(function (err) {
                responseError(response, err.message);
            });
        }).catch(function (err) {
            responseError(res, err.message?err.message:err);
        });
    });

    app.get('/me', function (req, res) {
        if (authorize.isAuthorize(req, ['administrator', 'user'])) {
            responseObject(res, req.user);
        }
        else {
            responsePermission(res);
        }
    });

    //USERS
    app.get('/users/:id', function (req, res) {
        User.get(req.params.id).then(function (model) {
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

    return app; 
}();