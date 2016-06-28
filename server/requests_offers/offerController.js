/**
 * Created by MS on 23.05.2016.
 * Logic: Is forwarded by offerRoutes and saves request to database. In this case a new offer according to Schema.
 */

// Load Schema of Offer
var Offer = require('./offerSchema');
var path = require('path');
var User = require('../users/structure.js');
var Booking = require("../booking/bookingSchema");

//For debugging purposes
console.log("offerController File geladen.");

//export so it can be invoked in offerRoutes
module.exports.postOffer = function (req, res) {

    //For debugging purposes
    console.log("Test date:" + req.body.date);

    //rename for easier usage
    var date = req.body.createdDate;
    var startday = req.body.startday;
    var starttime = req.body.starttime;
    var endday = req.body.endday;
    var endtime = req.body.endtime;
    var repeating = req.body.repeating;
    var typeofcare = req.body.typeofcare;
    var wageperhour = req.body.wageperhour;
    var location = req.body.location.name;
    var latitude = req.body.location.latitude;
    var longitude = req.body.location.longitude;
    var radius = req.body.location.radius;
    var notes = req.body.notes;

    console.log(location);
    console.log(radius);
    console.log(req.body);
    //######################
    //##### VALIDATION #####
    //######################
    if (!date) {
        res.status(400).send('date is required');
        console.log("date is not defined");
        return;
    }

    if (!startday) {
        res.status(400).send('startday is required');
        console.log("startday is not defined");
        return;
    }
    if (!starttime) {
        res.status(400).send('starttime is required');
        console.log("starttime is not defined");
        return;
    }
    if (!endtime) {
        res.status(400).send('endtime is required');
        console.log("endtime is not defined");
        return;
    }

    if (!typeofcare) {
        res.status(400).send('typeofcare is required');
        console.log("typeofcare is not defined");
        return;
    }

    if (!wageperhour) {
        res.status(400).send('wageperhour is required');
        console.log("wageperhour is not defined");
        return;
    }


    //#############################
    //##### SAVE TO DATABASE  #####
    //#############################

    //define new Offer object with given parts
    var offer = new Offer(req.body);

    //according to mongoose function save offer to database

    offer.save(function (err) {
        if (err) {
            res.status(500).send(err);
            console.log("Did not load to database");
            console.log(err);
        } else {
            console.log("Saved offer to database");
            res.send();
        }
    });
};
/*
 module.exports.getOffer = function(req, res){
 res.sendFile("/html/offerservice.html", { root: path.join(__dirname, '/../../public') });
 };
 */

module.exports.getOffers = function (req, res) {
    function parseResults(results) {
        var send = [];
        userids = [];
        for (x in results) {
            send.push({"offer": results[x]});
            userids.push(results[x].createdBy || "5759bd3581b11d042b6cf54e");
            if (typeof results[x].createdBy === "undefined") {
                send[send.length - 1].offer.createdBy = "5759bd3581b11d042b6cf54e";
            }
        }
        User.find({'_id': {$in: userids}}, function (err, users) {
            usersorted = {};
            for (user in users) {
                if (typeof users[user]._id !== "undefined") {
                    usersorted[users[user]._id] = users[user];
                }
            }
            for (x in send) {
                currUser = usersorted[send[x].offer.createdBy];
                send[x].user = {
                    firstname: currUser.firstName,
                    lastname: currUser.name,
                    picture: currUser.picture
                };
            }
            res.send(send);
        });
    }

    function runQuery(conditions){
        console.log("Search params: ", conditions);
        Offer.find(conditions).limit(25).exec(function (err, results) {
            parseResults(results);
        });
    }

    console.log("Search parameters: ", req.query);
    var searchParams = req.query;
    var conditions = {};
    var unbooked = false;
    for (var param in searchParams) {
        switch (param) {
            case "locationname":
                conditions["location.name"] = {
                    "$regex": searchParams[param],
                    "$options": "i"
                };
                break;
            case "lat":
            case "lng":
                var lat2 = searchParams["lat"];
                var lon2 = searchParams["lng"];
                conditions["$where"] =
                    '(this.location.radius/1000) >= (6371*2*Math.atan2(Math.sqrt(Math.sin((' +
                    lat2 + '-this.location.latitude)*(Math.PI/180)/2) * Math.sin((' +
                    lat2 + '-this.location.latitude)*(Math.PI/180)/2) + Math.cos(this.location.latitude*(Math.PI/180)) * Math.cos(' +
                    lat2 + '*(Math.PI / 180)) * Math.sin((' +
                    lon2 + '-this.location.longitude)*(Math.PI/180)/2) * Math.sin((' +
                    lon2 + '-this.location.longitude)*(Math.PI/180)/2)), Math.sqrt(1-(Math.sin((' +
                    lat2 + '-this.location.latitude)*(Math.PI/180)/2) * Math.sin((' +
                    lat2 + '-this.location.latitude)*(Math.PI/180)/2) + Math.cos(this.location.latitude*(Math.PI/180)) * Math.cos(' +
                    lat2 + '*(Math.PI / 180)) * Math.sin(( ' +
                    lon2 + '-this.location.longitude)*(Math.PI/180)/2) * Math.sin((' +
                    lon2 + '-this.location.longitude)*(Math.PI/180)/2)))))';

                break;
            case "typeofcare":
                conditions["typeofcare"] = searchParams[param]; // direct match
                break;
            case "priceMin":
                if (typeof conditions["wageperhour"] == "undefined") {
                    conditions["wageperhour"] = {};
                }
                conditions["wageperhour"].$gt = searchParams[param];
                break;
            case "priceMax":
                if (typeof conditions["wageperhour"] == "undefined") {
                    conditions["wageperhour"] = {};
                }
                conditions["wageperhour"].$lt = searchParams[param];
                break;
            case "startday":
                conditions["startday"].$lt = searchParams[param];
                break;
            case "starttime":
                conditions["starttime"].$lt = searchParams[param];
                break;
            case "endtime":
                conditions["endtime"].$gt = searchParams[param];
                break;
            //({"created_on": new Date(2012, 7, 14) })
             //'timestamp': {$gte: minDate}
            case "_id":
                conditions["_id"] = searchParams[param];
                break;
            case "booked":
                if(searchParams[param] == "true" || searchParams[param] == true){
                    unbooked = false;
                }
                break;
            case "caregiver":
                conditions["createdBy"] = searchParams[param];
                break;
        }

    }
    if(unbooked) {
        Booking.find().exec(function(err, results){
            var arr = results.map(function(item){ return item["offer"]});
            if(typeof conditions["_id"] == "undefined") {
                conditions["_id"] = {
                    $nin: arr
                };
            }
            else{
                conditions["_id"].$nin = arr;
            }
            runQuery(conditions);
        });
    }
    else{
        runQuery(conditions);
    }


};

module.exports.showmyOffer = function (req, res) {
    res.sendFile("/html/myoffers.html", {root: path.join(__dirname, '/../../public')});
};


module.exports.showLandingpage = function (req, res) {
    res.sendFile("/html/landingpage.html", {root: path.join(__dirname, '/../../public')});
};

module.exports.getmyOffer = function (req, res) {
    console.log("getmyOffer aufgerufen!");
    Offer.find(function (err, offers) {
        console.log("Offer find ausgeführt.");
        res.send(offers);
    })
};

//DELETE HANDLER
module.exports.deletemyOffer = function (req, res) {
    console.log("deletemyOffer aufgerufen!");
    console.log(req.params.offers_id);
    var id = req.params.offers_id;
    //delete : of id
    while(id.charAt(0) === ':')
        id = id.substr(1);

    console.log(id);
    Offer.findByIdAndRemove(id, function (err, offer) {
        if (err) {
            throw err;
        } else {
            console.log("erfolgreich gelöscht:" + id);
            res.send();
        }
    });

};

module.exports.updatemyOffer = function (req, res) {
    console.log("deletemyOffer aufgerufen!");
    console.log(req.params.offers_id);
    console.log(req.body);
    var id = req.params.offers_id;
    //delete : of id
    while(id.charAt(0) === ':')
        id = id.substr(1);

    //rename for easier usage
    console.log(id);
    var timeframe = req.body.timeframe;
    var typeofcare = req.body.typeofcare;
    var wageperhour = req.body.wageperhour;
    var location = req.body.location;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var radius = req.body.radius;
    var notes = req.body.notes;
  //  console.log(location);
  //  console.log(radius);
  //  console.log(createdDate);

    Offer.findByIdAndUpdate(id, {
        timeframe: timeframe,
        typeofcare: typeofcare,
        wageperhour: wageperhour,
        location: location,
        latitude: latitude,
        longitude: longitude,
        radius: radius,
        notes: notes
    }, {new: true}, function (err, offer) {
        if (err) {
            console.log(err);
            console.log("schade");
        } else {
            console.log("yo");
            res.send();
        }
    });

};