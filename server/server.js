/**
 * Created by sebas on 15/05/2016.
 */
var express = require("express");
var morgan  = require('morgan');
var app = express();

//This tells express to log via morgan
//and morgan to log in the "combined" pre-defined format
app.use(morgan('combined'));


var cors = require("cors");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var path = require("path");

var mongo = require("./config/config");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var passportLocal = require("passport-local");
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// pass passport for configuration
require('./auth/passport')(passport);
var jwt = require('jwt-simple');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

var mongostring =  "mongodb://" + mongo.username + ":" + mongo.password + "@" +
    mongo.url;

var mongoose = require("mongoose");
mongoose.connect(mongostring);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("open");

});

var passportConfig = require ("./config/passportConfig");
var User = require("./users/structure");

var authRoutes = require("./auth/authRouter");
app.use("/",authRoutes(passport));

app.get("/users", function (reg,res) {
    User.find(function (err,users) {
        res.send(users);
    })
});

app.post('/logout', function(req, res){ req.logOut(); res.send(200); });


var offerRoutes = require("./requests_offers/offerRoutes");
var bookingRouter = require("./booking/bookingRouter");
var ratingRouter = require("./rate/rateRouter");

app.use("/", offerRoutes(passport));
app.use("/", bookingRouter(passport));
app.use("/", ratingRouter(passport));




app.get("/failure", function(req,res) {
    res.send(200,"Hello World");
});
app.get("/", function(req,res) {
    res.sendFile("/html/index.html", { root: path.join(__dirname, '/../public') });
});

app.listen(3000);
module.exports = app;
