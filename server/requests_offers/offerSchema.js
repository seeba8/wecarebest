/**
 * Created by MS on 23.05.2016.
 */
var mongoose = require('mongoose');

console.log("Schema geladen.");
//define offer mongoose Schema
var offerSchema = mongoose.Schema({
    timestamp : Date,
    timeframe : Date,
    typeofcare : String,
    wageperhour: Number,
    supportedarea: String,
    notes: String

});

//define mongoose Model
var Offer = mongoose.model('Offer', offerSchema);

//export Module
module.exports = Offer;