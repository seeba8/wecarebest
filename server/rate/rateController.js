/**
 * Created by Layla M on 26.06.2016.
 */
var Rating = require('./rateSchema');
var Booking = require('../booking/bookingSchema'); //Fremdschlüsselreferenz
var Offer = require('../requests_offers/offerSchema'); //Fremdschlüsselreferenz
var User = require('../users/structure');
var path = require('path');
var jwt = require('jwt-simple');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;
var passport = require('passport');

var config = require('../config/passportConfig'); // get config file

//For debugging purposes
console.log("rateController File geladen.");

//add new rating
module.exports.postCreateRating = function(req, res) {
    //insert new rating from req.body
    var rating = new Rating(req.body);
    rating.save(function (err) {
        if (err) {
            res.status(500).send(err);
            console.log("Error during Rating.save: Did not load to database");
            console.log(err);
        } else {
            console.log("Saved rating to database");
            res.send();
        }
    });
};

//retrieve stars for rating (average)
module.exports.postShortRating = function(req, res) {
    conditions = {};
    var caregiver = req.body.caregiver;
    console.log("Caregiver:" + caregiver);
    conditions["caregiver"] = caregiver;
    Rating.find(conditions, function(err, ratings) {
        console.log(ratings);
        var returnItem = {};
        //ziehe alle vier sterne-bewertungen
        //ziehe anzahl
        var sum1 = 0;
        var count1 = 0;
        var sum2 = 0;
        var count2 = 0;
        var sum3 = 0;
        var count3 = 0;
        var sum4 = 0;
        var count4 =0;
        for(var i=0; i < ratings.length; i++){
            console.log(ratings[i]);
            if ('overallSatisfaction' in ratings[i]) {
                console.log("has property overallSatisfaction");
                sum1 = sum1 + ratings[i].overallSatisfaction;
                //console.log("satisfaction is: " + ratings[i].overallSatisfaction);
                count1 = count1 + 1;
            }
            if ('Friendliness' in ratings[i]) {
                console.log("has own property Friendliness");
                sum2 = sum2 + ratings[i].Friendliness;
                count2 = count2 + 1;
            }
            if ('Competence' in ratings[i]) {
                console.log("has own property Competence");
                sum3 = sum3 + ratings[i].Competence;
                count3 = count3 + 1;
            }
            if ('Punctuality' in ratings[i]) {
                console.log("has own property Punctuality");
                sum4 = sum4 + ratings[i].Punctuality;
                count4 = count4 + 1;
            }
        }
        //mittelwert errechnen
        if (count1 == 0) {
            returnItem.overallSatisfaction = null;
        } else {
            returnItem.overallSatisfaction = sum1/count1;
        }
        if (count2 == 0) {
            returnItem.Friendliness = null;
        } else {
            returnItem.Friendliness = sum2/count2;
        }
        if (count3 == 0) {
            returnItem.Competence = null;
        } else {
            returnItem.Competence = sum3/count3;
        }
        if (count4 == 0) {
            returnItem.Punctuality = null;
        } else {
            returnItem.Punctuality = sum4/count4;
        }
        returnItem.NoOfRatings = ratings.length;
        //objekt zurückgeben
        res.send(returnItem)
    })
};

//retrieve long text for rating (for one booking)
module.exports.postLongRating = function(req, res) {
    //alle Bewertungen (alle Daten) für Caregiver ziehen
    conditions = {};
    var caregiver = req.body.caregiver;
    conditions["caregiver"] = caregiver;
    Rating.find(conditions, function(err, ratings){
        //Objekt zurückgeben
        res.send(ratings);
    });
};