/**
 * Created by MS on 23.05.2016.
 */
var mongoose = require('mongoose');

console.log("Schema geladen.");
//define offer mongoose Schema
var frequencies = ["Weekly", "Bi-weekly", "Monthly"];
var typesofcare = ["Basic", "Premium", "Full Service"];
var offerSchema = mongoose.Schema({
    startday :      Date,
    starttime :     Date,
    endtime :       Date,
    repeating:      {type: Boolean, default: false},
    repeatoptions: {
        Monday:     {type: Boolean, default: false},
        Tuesday:    {type: Boolean, default: false},
        Wednesday:  {type: Boolean, default: false},
        Thursday:   {type: Boolean, default: false},
        Friday:     {type: Boolean, default: false},
        Saturday:   {type: Boolean, default: false},
        Sunday:     {type: Boolean, default: false},
        frequency:  {type: String, enum: frequencies},
        endday :    Date
    },
    typeofcare :    {type: String, enum: typesofcare},
    wageperhour:    {type: Number, min: 0, max: 100},
    location:       {
        latitude:   Number,
        longitude:  Number,
        name:       String,
        radius:     {type: Number, min: 100, required: "radius can't be blank"}
    },
    notes:          {type: String, maxlength: 400, trim: true},
    createddate:    Date
});

//define mongoose Model
var Offer = mongoose.model('Offer', offerSchema);

//export Module
module.exports = Offer;