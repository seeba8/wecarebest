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

var mongo = require("./config/config");
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
//var passportLocal = require("passport-local");
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

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

var register = require("./auth/register");
var login = require("./auth/login");
var UserStructure = require("./users/structure");


var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model("Kitten", kittySchema);
var silence = new Kitten({name:"loud"});
silence.save(function(err){
    if(err) console.log("KITTEN DIED");
});







//
/*
var product = new Product({name : "WebStorm"});
product.save(function (err) {
    if(err){
        console.log("failed");
    }
    else {
        console.log("saved");
    }

})*/
app.get("/", function(req,res) {
    Kitten.find(function (err, products) {
        res.send(products);
    })
});

app.get("/users", function (reg,res) {
    UserStructure.User.find(function (err,users) {
        res.send(users);
    })
});

app.post("/addUser", function(req,res) {
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
    var user = new UserStructure.User({
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
});

var isValidPassword = function(user, password){
    var compare;
    console.log("es wird was verglichen");
    compare = user.pwd == password;
    return compare;
};

passport.use('login',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function(searched_username, password, done) {
        console.log("test hier");
        UserStructure.User.findOne({ email: searched_username }, function(err, found_username) {
            if (err) { return done(err); }
            if (!found_username) {
                console.log('user not found');
                return done(null, false, { message: 'Incorrect email address.' });
            }
            if (!isValidPassword(found_username, password)) {
                console.log('incorrect PWD');
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    },
    console.log("hier passiert was")
));

app.post('/login', passport.authenticate('login', { successRedirect: '/',
    failureRedirect: '/failure'}));

app.post("/add", function(req,res) {
    var name = req.body.name;
    var product = new Kitten({name: name});
    product.save(function (err) {
        res.send();
    })
});

app.get("/failure", function(req,res) {
    res.send(200,"Hello World");
});

app.listen(3000);