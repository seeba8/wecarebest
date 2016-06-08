/**
 * Created by sebas on 15/05/2016.
 */
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var path = require("path");

var mongo = require("./config/config");
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
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
app.use("/",authRoutes());

app.get("/users", function (reg,res) {
    User.find(function (err,users) {
        res.send(users);
    })
});

/*app.post("/addUser", function(req,res) {
    var type = req.body.type;
    var firstName = req.body.firstName;
    var name = req.body.name;
    var street = req.body.street;
    var city = req.body.city;
    var postalCode = req.body.postalCode;
    var country = req.body.country;
    var phone = req.body.phone;
    var gender = req.body.gender;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var user = new User({
        type: type,
        firstName: firstName,
        name: name,
        street: street,
        city: city,
        postalCode: postalCode,
        country: country,
        phone: phone,
        gender: gender,
        email: email,
        pwd: pwd
    });
    user.save(function (err) {
        res.send();
    })
});*/


/*app.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        console.log(user);
        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.pwd, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, passportConfig.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});*/

app.post('/logout', function(req, res){ req.logOut(); res.send(200); });


var offerRoutes = require("./requests_offers/offerRoutes");

app.use("/", offerRoutes());




app.get("/failure", function(req,res) {
    res.send(200,"Hello World");
});
app.get("/", function(req,res) {
    res.sendFile("/html/index.html", { root: path.join(__dirname, '/../public') });
});

app.listen(3000);
module.exports = app;
