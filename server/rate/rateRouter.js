/**
 * Created by Layla M on 26.06.2016.
 */
module.exports = rateRoutes;

console.log("RateRouter geladen");

function rateRoutes(passport) {
    console.log("rateRoutes");
    var rateController = require('./rateController');
    var router = require('express').Router();
    var express = require("express");
    var path = require("path");

    router.use(express.static(path.join(__dirname, '/../../public/')));

    router.use(function(req, res, next) {
        console.log("Rate: " + req.method + req.url + req.path + res.data);
        next();
    });

    //add new Rating
    router.post('/createRating', passport.authenticate('jwt', {session: false}, rateController.postCreateRating));
    //retrieve stars for booking
    router.post('/shortRating', rateController.postShortRating);
    //always use post, as we need to transmit information in the body which alters the outcome (get would violate HTTP1.1 rules)
    //retrieve long rating text
    router.post('/longRating', rateController.postLongRating);

    return router;
}
