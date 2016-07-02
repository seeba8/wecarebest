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
        frequency:  {type: String, enum: frequencies}
    },
    endday :    Date,
    location:       {
        latitude:   Number,
        longitude:  Number,
        street: String,
        city: String,
        postalCode: String, /** this must be a string, as postal codes can potentially start with 0 (or user can be located abroad ...) */
        country: String
    },
    notes:          {type: String, maxlength: 400, trim: true},
    createdDate:    Date,
    lastActivity:   Date, //when did the status change the last time?
    createdBy:      String, //Careseeker
    offer:          String, //referenz auf das Objekt Offer, hier kann auch Caregiver und Type of Care ausgelesen werden
    status:         Number //1: Open Request/Waiting for Answer; 2: To be paid; 3: Ready/In the past (depending on timestamp); 4: cancelled
});

//define mongoose Model
var Booking = mongoose.model('Booking', bookingSchema);

//export Module
module.exports = Booking;