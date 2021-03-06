/**
 * Created by Layla M on 30.05.2016.
 */
module.exports = authRoutes;

console.log("AuthRouter geladen");

function authRoutes(passport) {
    console.log("authRoutes");
    var authController = require('./authController');
    var router = require('express').Router();
    var express = require('express');
    var path = require('path');

    //console.log(__dirname);
    //console.log(__dirname '/../../public');

    router.use(express.static(path.join(__dirname, '/../../public/')));

    router.use(function(req,res,next) {
        console.log('Auth: %s %s %s', req.method, req.url, req.path);
        //console.log('%s %s',req.body.pwd, req.body.pwd2);
        next();
    });

    router.put('/users', passport.authenticate('jwt', {session: false}), authController.putUser);


    router.route("/login")
        .post(authController.postLogin)
        .get(authController.getLogin);
    router.route("/addUser")
        .post(authController.postRegister)
        .get(authController.getRegister);
    return router;
}