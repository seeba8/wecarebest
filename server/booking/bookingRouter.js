/**
 * Created by MS on 13.06.2016.
 */
module.exports = bookingRoutes;

console.log("BookingRouter geladen");

function bookingRoutes(passport) {
    console.log("bookingRoutes");
    var bookingController = require('./bookingController');
    var router = require('express').Router();
    var express = require("express");
    var path = require("path");

    router.use(express.static(path.join(__dirname, '/../../public/')));

    router.use(function(req, res, next) {
        console.log("Booking: " + req.method + req.url + req.path + res.data);
        next();
    });

    //add new booking
    router.post('/createRequest', passport.authenticate('jwt', {session: false}), bookingController.postCreateRequest);

    //return create request page
    //router.get('/createRequest', passport.authenticate('jwt', {session: false}), bookingController.getCreateRequest);

    //view all bookings (potentially including offers); it depends on the type of user (caregiver, careseeker)
    router.post('/mybookings', passport.authenticate('jwt', {session: false}), bookingController.postMyBookings);
    //router.get('/mybookings', passport.authenticate('jwt', {session: false}, bookingController.getMyBookings));
    router.get('/mybookings', bookingController.getMyBookings);
    router.get("/bookings", passport.authenticate('jwt', {session: false}), bookingController.getBookings);

    //changes the booking status in the database (of an existing object)
    router.post('/ChangeBookingStatus', bookingController.postChangeBookingStatus);

    //TODO: brauchen wir das?
    router.route("/landingpage")
        .get(bookingController.showLandingpage);

    return router;
}

