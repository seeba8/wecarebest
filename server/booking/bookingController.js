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

//export so it can be invoked in offerRoutes
/*module.exports.postCreateRequest = function(req, res){
    //get content of req
    var date = req.body.createdDate;
    var startday = req.body.startday;
    var starttime = req.body.starttime;
    var endday = req.body.endday;
    var endtime = req.body.endtime;
    var repeating = req.body.repeating;
    var city = req.body.location.city;
    var street = req.body.location.street;
    var postalCode = req.body.location.postalCode;
    var country = req.body.location.country;
    var latitude = req.body.location.latitude;
    var longitude = req.body.location.longitude;
    var notes = req.body.notes;
    var offer = req.body.offer; //id of offer
    var careseeker = req.body.createdBy; //id of careseeker

    //#############################
    //##### SAVE TO DATABASE  #####
    //#############################

    //define new Offer object with given parts
    var booking = new Booking(req.body); //TODO: how to transfer status = 1?

    //according to mongoose function save booking to database

    booking.save(function(err) {
        if (err) {
            res.status(500).send(err);
            console.log("Did not load to database");
            console.log(err);
            return;
        } else {
            console.log("Saved offer to database");
            res.send();
        }
    });
};

module.exports.getCreateRequest = function(req, res){
    res.sendFile("/html/createRequest.html", { root: path.join(__dirname, '/../../public') });
};*/

module.exports.getMyBookings = function(req, res) {
    var secretOrKey = config.secret;
    console.log("in new function");

    conditions = {}; //empty conditions array

    conditions["createdBy"] = "575ec188dcba0f71fd406ec9"; // direct match

    var token = req.headers.authorization;
    token = token.substr(4);

    var decoded = jwt.decode(token, secretOrKey);
    console.log(decoded);

    var type = decoded.type;

    if(type == 1) {
        //caregiver
        //got to look into offer table first to find match
        Offer.find().exec(function(err, offers) {
            console.log("find suitable offers to match bookings");

            console.log(offers);
            myOffers = {};
            var arrayLength = offers.length;
            for (var i = 0; i < arrayLength; i++) {
                myoffers[i].createdBy = offers[i].createdBy;
                myoffers[i].id = offers[i].id;
            }
        })
    } else {
        //careseeker
        //directly use _id tag
        conditions["createdBy"] = decoded._id;
    }

    var opts = {};

    console.log(conditions);

    Booking.find(conditions).exec(function (err, bookings) {
        console.log("Booking find ausgeführt.");
        //console.log(bookings);
        res.send(bookings);
    });
};
/*module.exports.getMyBookings = function(req, res){
    //depending on user type, send different files!
    console.log("res" + res + "req" + req);
    usertype = 2; //TODO: read from database depending on current user object
    if(usertype == 1) {
        //user is caregiver
        res.sendFile("/html/mybookingscaregiver.html", {root: path.join(__dirname, '/../../public')});
    } else {
        //user is careseeker
        //res.sendFile("/html/mybookingscareseeker.html", {root: path.join(__dirname, '/../../public')});
        console.log("Careseeker - GetMyBookings aufgerufen!");
        Booking.find(function(err, bookings){
            console.log("Booking find ausgeführt.");
            //console.log(bookings);
            res.send(bookings);
        })
    }
};*/

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
    //update booking status to booking status from req.body

};

module.exports.showLandingpage = function(req, res){
    res.sendFile("/html/landingpage.html", { root: path.join(__dirname, '/../../public') });
};