/**
 * Created by MS on 13.06.2016.
 */

// Load Schema of Booking and Offer
var Booking = require('./bookingSchema');
var Offer = require('../requests_offers/offerSchema');
var User = require('../users/structure');
var path = require('path');
var jwt = require('jwt-simple');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;
var passport = require('passport');

var config = require('../config/passportConfig'); // get config file

//For debugging purposes
console.log("bookingController File geladen.");

module.exports.postCreateRequest = function(req, res) {
    //create new database entry from req.body
    //insert new rating from req.body
    var secretOrKey = config.secret;
    
    var token = req.headers.authorization;
    token = token.substr(4);

    var decoded = jwt.decode(token, secretOrKey);
    console.log(decoded);

    var careseeker = decoded._id;

    var booking = new Booking({
        startDay : req.body.startDay,
        starttime :     req.body.starttime,
        endtime :       req.body.endtime,
        repeating:      req.body.repeating,
        repeatoptions: req.body.repeating,
        location: req.body.repeating,
        notes:     req.body.notes,
        createdDate:    req.body.createdDate,
        lastActivity:   req.body.createdDate, //when did the status change the last time?
        createdBy:      careseeker, //Careseeker
        status : 1
    });
    booking.save(function (err) {
        if (err) {
            res.status(500).send(err);
            console.log("Error during Booking.save: Did not load to database");
            console.log(err);
        } else {
            console.log("Saved rating to database");
            res.send();
        }
    });
};

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

    //Get Offers and according bookings. 
    var getBookings = function(callback) {
        //caregiver
        //got to look into offer table first to find match
        console.log("Type 1");
        var condOffers = {};
        //ondOffers["createdBy"] = userid;
        console.log(condOffers);
        Offer.find({'createdBy': {$in: userid}}, function(err, offers) {
            console.log("1: Find suitable offers to match bookings");

            var offersarr =[];
             for(var i=0; i < offers.length; i++){
                 console.log("offer: " + offers[i]._id);
                 offersarr.push(offers[i]._id);
             }

            console.log(offersarr);

            Booking.find({'offer': {$in: offersarr}}, function(err, bookings){

                var b;
                var u;
                var bookingsusersarr = [];
                var result = [];
                for(var i=0; i < bookings.length; i++){
                    console.log("bookings: " + bookings[i].createdBy);
                    bookingsusersarr.push( bookings[i].createdBy);
                }

                User.find({'_id': {$in: bookingsusersarr}}, function(err, users){
                    console.log(users[0]);
                    for(booking in bookings){
                        for(user in users){
                            if(bookings[booking].createdBy == users[user]._id){
                                //console.log(bookings[booking]._id + " und " + users[user]._id );
                                b = bookings[booking];
                                u = users[user];
                                console.log(booking);
                                //console.log(b);
                                //console.log(u);
                                result.push({booking:b, user:u});
                                console.log(result[0]);
                            }
                        }
                    }

                    console.log("2: Print bookings for caregiver");
                    //console.log(bookings[0]);
                    resultingBookings = result;
                    callback(resultingBookings);


                });
             })


            // var arrayLength = offers.length;
            // thingwithcallback(arrayLength,offers,function(bookings, callback){
            //     resultingBookings.push(bookings);
            // });
            //console.log("5");
        })
    }

    //Send Bookings by HTTP 
    var sendBookings = function(data){
        console.log("3: Send Caregiver Bookings Data.");
        res.send(data);
        //console.log("Final: " + data);
    }



    if(type == 1) {
        //Invoke function.
        getBookings(sendBookings);

        // //caregiver
        // //got to look into offer table first to find match
        // console.log("Type 1");
        // var condOffers = {};
        // condOffers["createdBy"] = userid;
        // console.log(condOffers);
        // Offer.find(condOffers, function(err, offers) {
        //     console.log("find suitable offers to match bookings");
        //     console.log("offer: " + offers);
        //
        //     var arrayLength = offers.length;
        //     for (var i = 0; i < arrayLength; i++) {
        //         console.log("find bookings matching the offer ids");
        //         conditions["offer"] = offers[i].id;
        //         //console.log(conditions);
        //         Booking.find(conditions, function (err, bookings) {
        //             console.log("print bookings for caregiver");
        //             //console.log(bookings);
        //             //resultingBookings += bookings;
        //             resultingBookings.push(bookings);
        //             console.log("resulting bookings " + i +" : " + resultingBookings);
        //         });
        //     }
        //     console.log("resulting bookings for type caregiver");
        //     console.log("Final: " + resultingBookings);
        //     res.send(resultingBookings);
        // })
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