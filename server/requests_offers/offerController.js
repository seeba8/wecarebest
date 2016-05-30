/**
 * Created by MS on 23.05.2016.
 * Logic: Is forwarded by offerRoutes and saves request to database. In this case a new offer according to Schema.
 */

// Load Schema of Offer
var Offer = require('./offerSchema');

//For debugging purposes
console.log("offerController File geladen.");

//export so it can be invoked in offerRoutes
module.exports.postOffer = function(req, res){

    //For debugging purposes
    console.log("Test date:" + req.body.date);

    //rename for easier usage
    var date = req.body.date;
    var timeframe = req.body.timeframe;
    var typeofcare = req.body.typeofcare;
    var wageperhour = req.body.wageperhour;
    var supportedarea = req.body.supportedarea;
    var notes = req.body.notes;


    //######################
    //##### VALIDATION #####
    //######################
    if(!date){
        res.status(400).send('date is required');
        console.log("date is not defined");
        return;
    }

    if(!timeframe){
        res.status(400).send('timeframe is required');
        console.log("timeframe is not defined");
        return;
    }

    if(!typeofcare){
        res.status(400).send('typeofcare is required');
        console.log("typeofcare is not defined");
        return;
    }

    if(!wageperhour){
        res.status(400).send('wageperhour is required');
        console.log("wageperhour is not defined");
        return;
    }

    if(!supportedarea){
        res.status(400).send('Supported area is required');
        console.log("Supported area not defined");
        return;
    }


    //#############################
    //##### SAVE TO DATABASE  #####
    //#############################

    //define new Offer object with given parts
    var offer = new Offer({timestamp:date, timeframe:timeframe, typeofcare:typeofcare, wageperhour:wageperhour, supportedarea: supportedarea, notes: notes});
    
    //according to mongoose function save offer to database
    offer.save(function(err) {
        if (err) {
            res.status(500).send(err);
            console.log("Did not load to database");
            console.log(err);
            return;
        } else {
            console.log("Saved offer to database");
            res.send();
        }
    });
};

module.exports.getOffer = function(req, res){
    res.sendfile("public/html/offerservice.html");
}