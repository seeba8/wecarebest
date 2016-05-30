/**
 * Created by MS on 23.05.2016.
 */
module.exports = offerRoutes;
//var Offer = require('./offerSchema');

console.log("OfferRoutes geladen");

function offerRoutes() {
    console.log("offerRoutes");
    var offerController = require('./offerController');
    var router = require('express').Router();
    var express = require("express");
    var path = require("path");

    router.use(express.static(path.join(__dirname, '/../../public/')));

    router.use(function(req, res, next) {
        console.log('%s %s %s', req.method, req.url, req.path);
        next();
    });

    router.route("/offers")
        .post(offerController.postOffer)
        .get(offerController.getOffer);
    return router;

}
