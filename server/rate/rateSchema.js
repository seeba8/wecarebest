/**
 * Created by Layla M on 26.06.2016.
 */
var mongoose = require('mongoose');

console.log("Rating Schema geladen.");
//define offer mongoose Schema
var rateSchema = mongoose.Schema({
    booking : String,
    //per Fremdschlüsselreferenz:
    //booking -> Offer
    //booking -> createdBy (Careseeker)
    //booking -> Offer -> createdBy (Caregiver)
    caregiver : String, //referenz auf Caregiver-Objekt (gewollte redundanz, um komplexität bei den abfragen zu reduzieren)
    createdDate : Date,
    otherRemarks : {type: String, maxlength: 400, trim: true},
    personalFeedback : {type: String, maxlength: 400, trim: true},
    overallSatisfaction : { type: Number, min: 0, max: 5 },
    Friendliness : { type: Number, min: 0, max: 5 },
    Competence : { type: Number, min: 0, max: 5 },
    Punctuality : { type: Number, min: 0, max: 5 }
});

//define mongoose Model
var Rating = mongoose.model('Rating', rateSchema);

//export Module
module.exports = Rating;
