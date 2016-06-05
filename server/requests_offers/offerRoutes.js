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
    
    //Create Offer Form
    router.route("/offers")
        //put offer form into database
        .post(offerController.postOffer)
        //get offer form
        .get(offerController.getOffer);
    
    //invokes backend functionality to get all offers documents in mongodb
    router.route("/getmyoffers")
        .get(offerController.getmyOffer);
    //Show List of offers
    router.route("/showmyoffers")
        .get(offerController.showmyOffer);
    
    //Invokes backend functionality to delete offers document in mongodb
    router.route("/deletemyoffer")
        .post(offerController.deletemyOffer);

    //Invokes backend functionality to delete offers document in mongodb
    router.route("/updatemyoffer")
        .post(offerController.updatemyOffer);

    return router;
}

