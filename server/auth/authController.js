/**
 * Created by Layla M on 30.05.2016.
 */

// Load Schema of Offer
var User = require('./../users/structure');
var path = require('path');
var jwt = require('jwt-simple');
var passportConfig = require ("../config/passportConfig");
//For debugging purposes
console.log("authController File geladen.");

//export so it can be invoked in offerRoutes
module.exports.postLogin = function(req, res){
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
                    var token = jwt.encode({
                        _id: user._id,
                        type: user.type,
                        firstName: user.firstName
                    }, passportConfig.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: token}); //not res.send?
                    //res.send({success: true, token: 'JWT ' + token}); //not res.send?
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};

module.exports.postRegister = function(req, res) {
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
    var pwd2 = req.body.pwd2;

    if(!type){
        res.status(400).send('type is required');
        console.log("type is not defined");
        return;
    }

    if(!name){
        res.status(400).send('name is required');
        console.log("name is not defined");
        return;
    }

    if(!email){
        res.status(400).send('email is required');
        console.log("email is not defined");
        return;
    }

    if(!pwd){
        res.status(400).send('pwd is required');
        console.log("pwd is not defined");
        return;
    }

    if(!pwd2){
        res.status(400).send('pwd2 is required');
        console.log("pwd2 is not defined");
        return;
    }

    console.log(pwd,pwd2);
    if(!(pwd==pwd2)) {
        res.status(400).send('pwd and pwd2 must match');
        console.log("pwd and pwd2 dont match");
        return;
    }

    console.log("creating new user");
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
        console.log("Save it to database...");
        if (err) {
            res.status(500).send(err);
            console.log("...ERROR. Did not load to database");
            console.log(err);
        } else {
        console.log("...SUCCESS. Created User.");
        res.send();
        }
    })
};
module.exports.getLogin = function(req, res){
    res.sendfile("/html/login.html", { root: path.join(__dirname, '/../../public') });
};
module.exports.getRegister = function(req, res){
    res.sendfile("/html/registration.html", { root: path.join(__dirname, '/../../public') });
};