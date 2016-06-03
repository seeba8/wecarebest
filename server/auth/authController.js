/**
 * Created by Layla M on 30.05.2016.
 */

// Load Schema of Offer
var User = require('./../users/structure');
var path = require('path');

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
                    var token = jwt.encode(user, passportConfig.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
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
};
module.exports.getLogin = function(req, res){
    res.sendfile("/html/login.html", { root: path.join(__dirname, '/../../public') });
};
module.exports.getRegister = function(req, res){
    res.sendfile("/html/registration.html", { root: path.join(__dirname, '/../../public') });
};