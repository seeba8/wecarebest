/**
 * Created by Layla M on 30.05.2016.
 */
module.exports = authRoutes;

console.log("AuthRouter geladen");

function authRoutes() {
    console.log("authRoutes");
    var authController = require('./authController');
    var router = require('express').Router;
    var express = require('express');
    var path = require('path');

    console.log(__dirname);
    console.log(__dirname + '/../../public');

    router.use(express.static(path.join(__dirname + '/../../public')));

    router.use(function(req,res,next) {
        console.log('%s %s %s', req.method, req.url, req.path);
        next();
    });

    router.route("/login")
        .post(authController.postLogin)
        .get(authController.getLogin);
    router.route("/addUser")
        .post(authController.postRegister)
        .get(authController.getRegister);
    return router;
}