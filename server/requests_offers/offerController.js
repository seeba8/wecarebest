/**
 * Created by MS on 23.05.2016.
 * Logic: Is forwarded by offerRoutes and saves request to database. In this case a new offer according to Schema.
 */

// Load Schema of OFfer
var Offer = require('./offerSchema');

//For debugging purposes
console.log("offerController File geladen.");

//export so it can be invoked in offerRoutes
module.exports.postOffer = function(req, res){

    //For debugging purposes
    console.log("Test wageperhour:" + req.body.wageperhour);

    //rename for easier usage
    var timeframe = req.body.timeframe;
    var typeofcare = req.body.typeofcare;
    var wageperhour = req.body.wageperhour;
    var supportedarea = req.body.supportedarea;
    var notes = req.body.notes;

    /*
    TODO Data Validation on Backend
    TODO Authentification Validation on Backend
    if(!supportedarea){
        res.status(400).send('username required');
        console.log("Supported area not defined");
        return;
    }
    */

    //define new Offer object with given parts
    var offer = new Offer({timeframe:timeframe, typeofcare:typeofcare, wageperhour:wageperhour, supportedarea: supportedarea, notes: notes});
    
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
