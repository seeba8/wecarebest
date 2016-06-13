/**
 * Created by Layla M on 13.06.2016.
 */
var mongoose = require('mongoose');

console.log("Booking Schema geladen.");
//define offer mongoose Schema
var frequencies = ["Weekly", "Bi-weekly", "Monthly"];
var bookingSchema = mongoose.Schema({
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
    location:       {
        latitude:   Number,
        longitude:  Number,
        name:       String
    },
    notes:          {type: String, maxlength: 400, trim: true},
    createdDate:    Date,
    createdBy:      String, //Careseeker
    offer:          String, //referenz auf das Objekt Offer, hier kann auch Caregiver und Type of Care ausgelesen werden
    status:         int //1: Caregiver requested, 2:
});

//define mongoose Model
var Booking = mongoose.model('Booking', bookingSchema);

//export Module
module.exports = Booking;