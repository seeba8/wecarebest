angular.module('myApp').controller('CreateOfferCtrl', ['$interval', '$scope', '$http','$window', 'uiGmapGoogleMapApi', "auth", function($interval, $scope, $http, $window, uiGmapGoogleMapApi, auth) {
    var app = this;
    var url = 'http://localhost:3000';
    var geocoder;
    var lastcenter = null;
    console.log("loaded create offer controller");

    var config = {
        /*headers: {
            Authorization: "JWT " + $window.localStorage['jwtToken'],
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }*/
    };

    uiGmapGoogleMapApi.then(function (maps) {
        geocoder = new maps.Geocoder;
    });

    $scope.offer = {
        startday: moment().toDate(),
        repeating: false,
        location: {
            latitude: 48.1,
            longitude: 11.5,
            name: "Munich, Germany",
            radius: 5000
        }
    };

    data = $scope.offer;

    $(function () {
        $('.startdaypicker').datetimepicker({
            format: "L",
            minDate: moment(),
            useCurrent: false //Important! See issue #1075
        })
            .on('dp.change', function (e) {
                console.log(e.date);
                $('.enddaypicker').data("DateTimePicker").minDate(e.date);
                $scope.offer.startday = e.date.toDate();
                $scope.$apply();
            });
    });
    $(function () {
        $('.starttimepicker').datetimepicker({
            format: "LT"
        })
            .on('dp.change', function (e) {
                $scope.offer.starttime = e.date.toDate();
                $scope.$apply();
            });
    });

    $(function () {
        $('.endtimepicker').datetimepicker({
            format: "LT"
        })
            .on('dp.change', function (e) {
                $scope.offer.endtime = e.date.toDate();
                $scope.$apply();
            });
    });

    $(function () {
        $('.enddaypicker')
            .datetimepicker({
                format: "L",
                minDate: moment(),
                useCurrent: false //Important! See issue #1075
            })
            .on('dp.change', function (e) {
                $('.startdaypicker').data("DateTimePicker").maxDate(e.date);
                $scope.offer.endday = e.date.toDate();
                $scope.$apply();
            });
    });


    $scope.map = {
        center: {
            latitude: 48.1,
            longitude: 11.5,
            name: "München"
        },
        zoom: 10,
        options: {
            scaleControl: true,
            mapTypeControl: false,
            streetViewControl: false
        },
        events: {
            click: function (mapModel, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                $scope.circle.center = e.latLng;
                $scope.$apply();
            }
        }
    };
    $scope.search = {
        template: "searchbox.tpl.html",
        events: {
            place_changed: function (autocomplete) {
                var place = autocomplete.getPlace();
                if (place.address_components) {
                    $scope.map.center = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    $scope.offer.location.latitude = place.geometry.location.lat();
                    $scope.offer.location.longitude = place.geometry.location.lng();
                    $scope.offer.location.name = place.formatted_address;
                    $scope.$apply();
                }
            }
        },
        parentDiv: "searchBoxParent",
        options: {
            autocomplete: true,
            types: ['(cities)'],
            componentRestrictions: {country: 'de'} //only works for one country, not multiple codes. remove if necessary
        }
        // position: "top-left"
    };

    $scope.circle = {
        stroke: {
            color: '#08B21F',
            weight: 2,
            opacity: 1
        },
        fill: {
            color: '#08B21F',
            opacity: 0.2
        },
        geodesic: true, // optional: defaults to false
        draggable: true, // optional: defaults to false
        clickable: true, // optional: defaults to true
        editable: true, // optional: defaults to false
        visible: true, // optional: defaults to true
        control: {},
        events: {
            radius_changed: function (arg) {
                $scope.offer.location.radius = Math.round(arg.radius);
            },
            dragend: function (test) {
                geocoder.geocode({
                        "location": {
                            lat: $scope.offer.location.latitude,
                            lng: $scope.offer.location.longitude
                        }
                    }
                    , function (results, status) {
                        if (status == "OK" && results != null) {
                            $scope.offer.location.name = results[0].formatted_address;
                            for (var i = 0; i < results.length; i++) {
                                var result = results[i];
                                if (result.types[0] == "locality") {
                                    $scope.offer.location.name = result.formatted_address;
                                    break;
                                }
                            }
                            $('#searchbox').val($scope.offer.location.name);
                            $scope.$apply();
                        }
                    });
            }
        }
    };



    // $scope.onlyNumbers = /^[0-9]+$/;

    $scope.typeofcares = [
        'Basic',
        'Premium',
        'Full Service'
    ];

    $scope.weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];


    $scope.frequencies = [
        'Weekly',
        'Bi-weekly',
        'Monthly'
    ];

    $scope.submitted = false;

    $scope.submit = function () {
        // Trigger validation flag. True because user clicked on submit.
        $scope.submitted = true;
        $scope.errormessages = null;

        console.log("Clicked Submit Offer...");


        //Validate form input. If fine then send data via HTTP POST to server. Otherwise show error.
        if ($scope.Offer.$valid) {
            data.location.name = $scope.offer.location.name;
            console.log(data.location.name);
            $scope.offer.createdDate = new Date();
            $scope.offer.createdBy = auth.parseJwt($window.localStorage['jwtToken'])._id;
            console.log($scope.offer.createdDate);
            console.log("Form is valid. Insert it...");
            $scope.statusmessages = 'OK! Sending offer.';
            //data["jwt"] = $window.localStorage['jwtToken'];

            $http.post(url + "/offers", data, config).success(function () {
                $scope.PostDataResponse = data;
                $scope.messages = 'Success! Your offer has been created!';
                $scope.statusmessages = null;
                console.log("...Inserted Successfully!");
                $window.location.href = "/#/mybookingscaregiver";
            })
            //IF error in HTTP POST then log it and show to user
                .error(function (data, status, header, config) {
                    $scope.ResponseDetails = "Data: " + data +
                        "<hr />status: " + status +
                        "<hr />headers: " + header +
                        "<hr />config: " + config;
                    $scope.errormessages = 'Sorry! There was a network error. Try again later.';
                    $scope.statusmessages = null;
                    //$log.error(data);
                });
        } else if (!$scope.Offer.$valid) {
            $scope.errormessages = 'Sorry! Offer is not valid. Please consider remarks.';
            console.log("...Form not valid.")
        }
    };

    $scope.interacted = function (field) {
        try {
            return $scope.submitted || field.$dirty;
        } catch (e) {
            // throws all kinds of errors. Not interested in them. I think they're connected to the bootstrap datepicker
        }
    };


    /*
     * #############################################################################
     * #############################################################################
     * ############################## MYOFFERS.HTML ################################
     * #############################################################################
     * #############################################################################
     * ########### HANDLE SHOW OFFERS [myoffers.html] AND DELETE/UPDATE ############
     * #############################################################################
     * #############################################################################
     * */
    app.recent = true;
    $http.get(url + "/getmyOffers", config).success(function (offers) {
        console.log("Get Offers.");
        app.offerfinals = offers;
        //console.log(app.offerfinals);
    });

    /*
     * #############################################################################
     * ##### INVOKED BY CLICK ON DELETE BUTTON IN myoffers.html ####################
     * ##### DELETE DOCUMENT BY ID FROM DATABASE AND ARRAY IN FRONTEND #############
     * #############################################################################
     * */
    $scope.deleteOffer = function(id, index) {
        console.log(index);
        //delete offer from array in frontend.
        app.offerfinals.splice(index, 1);

        var data = {};
        data.id = id;
        console.log(data);

        //send it as http post to backend in order to delete it in database
        $http.post(url + "/deletemyoffer", data).success(function(){
            console.log("clicked:" + data);
            $scope.PostDataResponse = data;
            console.log("Löschung beendet.");
        })
        //IF error in HTTP POST then log it and show to user
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
                console.log($scope.ResponseDetails);
            });
    };
    /*
     * #############################################################################
     * ##### INVOKED BY CLICK ON Update BUTTON IN myoffers.html ####################
     * ##### UPDATE DOCUMENT BY ID FROM DATABASE AND ARRAY IN FRONTEND #############
     * #############################################################################
     * */
    $scope.updateOffer = function(offerItem, index) {

        // $scope.editing = {};
        offerItem.startDay = new Date(offerItem.startDay);
        console.log(index);
        console.log(offerItem);

        $scope.offer.startDay = offerItem.startDay;
        $scope.offer.typeofcare = offerItem.typeofcare;
        $scope.offer.wageperhour = offerItem.wageperhour;
        $scope.offer.location = offerItem.location;
        $scope.offer.notes = offerItem.notes;


        $scope.saveUpdate = function(item){

            console.log($scope.Offer.$valid);
            console.log($scope.offer);
            console.log(item);
            if($scope.Offer.$valid){
                item.location = item.center.name;
                item.latitude = item.center.latitude;
                item.longitude = item.center.longitude;

                console.log("Saved Changes.");
                offerItem.timeframe = item.timeframe;
                offerItem.typeofcare = item.typeofcare;
                offerItem.wageperhour = item.wageperhour;
                offerItem.location.name = item.location.name;
                offerItem.latitude = item.latitude;
                offerItem.longitude = item.longitude;
                offerItem.radius = item.radius;
                offerItem.notes = item.notes;
                offerItem.id = offerItem._id;
                app.updateOffer(offerItem);

            } else {
                console.log("Not valid form.");
            }
        }

    };

    app.updateOffer = function ( PushCandidate) {
        $http.post("../updatemyoffer",  PushCandidate).success(function () {
            console.log("Updated successfully");
        })
    };
}]);
