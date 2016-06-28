/**
 * Created by MS on 23.05.2016.
 */
module.exports = offerRoutes;
//var Offer = require('./offerSchema');

console.log("OfferRoutes geladen");

function offerRoutes(passport) {
    console.log("offerRoutes");
    var offerController = require('./offerController');
    var router = require('express').Router();
    var express = require("express");
    var path = require("path");

    router.use(express.static(path.join(__dirname, '/../../public/')));

    router.use(function(req, res, next) {
        console.log('Offer: %s %s %s', req.method, req.url, req.path);
        next();
    });
    
    //Create Offer Form
    //router.route("/offers")
        //put offer form into database
        //get offer form
    router.get('/offers',offerController.getOffers);
    router.post('/offers', passport.authenticate('jwt', {session: false}), offerController.postOffer);
    router.put('/offers/:offers_id', passport.authenticate('jwt', {session: false}), offerController.updatemyOffer);
    router.delete('/offers/:offers_id', passport.authenticate('jwt', {session: false}),offerController.deletemyOffer);
    
    
    
    //invokes backend functionality to get all offers documents in mongodb
    router.get("/getmyoffers",  passport.authenticate('jwt', {session: false}), offerController.getmyOffer);
    //Show List of offers
    // router.route("/showmyoffers")
    //     .get(offerController.showmyOffer);
    
    //Invokes backend functionality to delete offers document in mongodb
    router.route("/updatemyoffer")
        .post(offerController.updatemyOffer);
    
    //Get Landing Page
    router.route("/landingpage")
        .get(offerController.showLandingpage);

    return router;
}

