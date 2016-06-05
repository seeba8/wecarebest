/**
 * Created by MS on 23.05.2016.
 */
var mongoose = require('mongoose');

console.log("Schema geladen.");
//define offer mongoose Schema
var offerSchema = mongoose.Schema({
    startday : Date,
    starttime : Date,
    endday : Date,
    endtime : Date,
    typeofcare : String,
    wageperhour: Number,
    location: String,
    latitude : Number,
    longitude : Number,
    radius: Number,
    notes: String

});

//define mongoose Model
var Offer = mongoose.model('Offer', offerSchema);

//export Module
module.exports = Offer;