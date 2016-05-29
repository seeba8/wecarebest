/**
 * Created by Layla M on 28.05.2016.
 */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: Number,
    type: { type: Number, min: 1, max: 2 }, /** 1 for caregiver, 2 for careseeker */
    firstName: String,
    name: String,
    street: String,
    city: String,
    postalCode: String, /** this must be a string, as postal codes can potentially start with 0 (or user can be located abroad ...) */
    country: String,
    phone: String, /** begins with 0, thus String */
    email: String,
    pwd: String,
    gender: { type: Number, min: 1, max: 2 } /** 1 for female, 2 for male */
});
var User = mongoose.model("User", userSchema);


module.exports = {
    User: User
};