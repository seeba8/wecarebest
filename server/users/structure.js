/**
 * Created by Layla M on 28.05.2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    type: { type: Number, min: 1, max: 2 }, /** 1 for caregiver, 2 for careseeker */
    firstName: String,
    name: String,
    street: String,
    city: String,
    postalCode: String, /** this must be a string, as postal codes can potentially start with 0 (or user can be located abroad ...) */
    country: String,
    phone: String, /** begins with 0, thus String */
    email: {
        unique: true,
        type: String,
        required: true
    },
    pwd: String,
    gender: { type: Number, min: 1, max: 2 } /** 1 for female, 2 for male */,
    picture: {
        data: String,
        contentType: String
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('pwd') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.pwd, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.pwd = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (pwd, cb) {
    bcrypt.compare(pwd, this.pwd, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        console.log(isMatch);
        cb(null, isMatch);
    });
};


var User = mongoose.model("User", userSchema);

module.exports = mongoose.model('User', userSchema);