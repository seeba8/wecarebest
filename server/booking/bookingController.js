/**
 * Created by MS on 13.06.2016.
 */

// Load Schema of Booking and Offer
var Booking = require('./bookingSchema');
var Offer = require('../requests_offers/offerSchema');
var path = require('path');
var jwt = require('jwt-simple');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;
var passport = require('passport');

var config = require('../config/passportConfig'); // get config file

//For debugging purposes
console.log("bookingController File geladen.");

module.exports.getMyBookings = function(req, res) {
    var resultingBookings = [];
    var secretOrKey = config.secret;
    console.log("in new function");

    conditions = {}; //empty conditions array

    //conditions["createdBy"] = "575ec188dcba0f71fd406ec9"; // direct match

    var token = req.headers.authorization;
    token = token.substr(4);

    var decoded = jwt.decode(token, secretOrKey);
    console.log(decoded);

    var type = decoded.type;
    var userid = decoded._id;

    if(type == 1) {
        //caregiver
        //got to look into offer table first to find match
        console.log("Type 1");
        var condOffers = {};
        condOffers["createdBy"] = userid;
        console.log(condOffers);
        Offer.find(condOffers, function(err, offers) {
            console.log("find suitable offers to match bookings");

            var arrayLength = offers.length;
            for (var i = 0; i < arrayLength; i++) {
                console.log("find bookings matching the offer ids");
                conditions["offer"] = offers[i].id;
                //console.log(conditions);
                Booking.find(conditions, function (err, bookings) {
                    console.log("print bookings for caregiver");
                    console.log(bookings);
                    //resultingBookings += bookings;
                    resultingBookings.push(bookings);
                });
            }
            console.log("resulting bookings for type caregiver");
            console.log(resultingBookings);
            res.send(resultingBookings);
        })
    } else {
        //careseeker
        //directly use _id tag
        conditions["createdBy"] = userid;
        console.log(conditions);
        Booking.find(conditions, function (err, bookings) {
            console.log("print bookings for careseeker");
            console.log(bookings);
            //resultingBookings += bookings;
            resultingBookings.push(bookings);
            console.log("resulting bookings");
            console.log(resultingBookings);
            res.send(bookings);
            //console.log(resultingBookings);
        })
    }
};


module.exports.postMyBookings = function(req, res){
    //depending on user type, send different files!
    usertype = 2; //TODO: read from database depending on current user object
    if(usertype == 1) {
        //user is caregiver
        res.sendFile("/html/mybookingscaregiver.html", {root: path.join(__dirname, '/../../public')});
    } else {
        //user is careseeker
        res.sendFile("/html/mybookingscareseeker.html", {root: path.join(__dirname, '/../../public')});
    }
};

module.exports.postChangeBookingStatus = function(req, res) {
    console.log("updateBooking aufgerufen!");
    console.log(req.body);
    var id = req.body._id;
    var status = req.body.status;
    var targetStatus = req.body.targetStatus;

    Booking.findByIdAndUpdate(id, {status:targetStatus}, {new: true}, function(err){
        if (err) {
            console.log(err);
            console.log("schade");
            return;
        } else {
            console.log(status);
            res.send();
        }
    });

};

module.exports.showLandingpage = function(req, res){
    res.sendFile("/html/landingpage.html", { root: path.join(__dirname, '/../../public') });
};