/**
 * Created by MS on 23.05.2016.
 */

var offerApp = angular.module('offerApp', ['ui.bootstrap.showErrors', 'ngMessages',"uiGmapgoogle-maps"]);

offerApp.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
    showErrorsConfigProvider.showSuccess(true);
}]);
offerApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCLOfEshWapwoqrg5qMVjhpG1DB75lvjTE',
        //v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'places'
    });
});

offerApp.run(['$templateCache', function ($templateCache) {
    $templateCache.put('searchbox.tpl.html', '<input type="text" class="form-control" id="searchbox" onkeydown="if (event.keyCode == 13) {event.preventDefault(); event.stopPropagation();}"  name="supportedarea" ng-model="test" ng-minlength="3" placeholder="Enter city" required>');
}]);
offerApp.controller('CreateOfferCtrl', ['$scope', '$http',  function($scope, $http) {
    var app = this;
    var url = 'http://localhost:3000';

    $scope.offer = {};
    data = $scope.offer;


    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }}
        ;
    $scope.map = {
        center: {
            latitude: 48.1,
            longitude: 11.5},
        zoom: 10,
        options: {
            scaleControl: true,
            mapTypeControl: false,
            streetViewControl: false,
        },
        events: {
            click: function(mapModel, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                $scope.circle.center = e.latLng;
                $scope.$apply();
            }
        }
    };
    $scope.search = {
        template:"searchbox.tpl.html",
        events: {
            place_changed: function(autocomplete) {
               var  place = autocomplete.getPlace();
                if (place.address_components) {
                    $scope.map.center = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    $scope.circle.center = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                }
            }
        },
        parentDiv: "searchBoxParent",
        options: {
            autocomplete:true,
            types: ['(cities)'],
            componentRestrictions: {country: 'de'} //only works for one country, not multiple codes. remove if necessary
        }
       // position: "top-left"
    };
    $scope.circle = {
        center: {
            latitude: 48.13,
            longitude: 11.57
        },
        radius: 5000,
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
        control: {}
    };
    var PushCandidate = $scope.offer;
    app.saveOffer = function ( PushCandidate) {
        $http.post("../offers",  PushCandidate).success(function () {
            console.log("Inserted Successfully");
        })
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
    $scope.submit = function() {
        // Trigger validation flag. True because user clicked on submit.
        $scope.submitted = true;
        $scope.errormessages = null;

        console.log("Clicked Submit Offer...");


        //Validate form input. If fine then send data via HTTP POST to server. Otherwise show error.
        if($scope.Offer.$valid){
            console.log($scope.offer.supportedarea);
            $scope.offer.date = new Date();
            console.log("Form is valid. Insert it...")
            $scope.statusmessages = 'OK! Sending offer.';
            $http.post(url + "/offers", data).success(function(){
                $scope.PostDataResponse = data;
                $scope.messages = 'Success! Your offer has been created!';
                $scope.statusmessages = null;
                console.log("...Inserted Successfully!");
            })
                //IF error in HTTP POST then log it and show to user
                .error(function (data, status, header, config) {
                    $scope.ResponseDetails = "Data: " + data +
                        "<hr />status: " + status +
                        "<hr />headers: " + header +
                        "<hr />config: " + config;
                    $scope.errormessages = 'Sorry! There was a network error. Try again later.';
                    $scope.statusmessages = null;
                    $log.error(data);
                });
        } else if (!$scope.Offer.$valid) {
            $scope.errormessages = 'Sorry! Offer is not valid. Please consider remarks.';
            console.log("...Form not valid.")
        }
    };

    $scope.interacted = function(field) {
        return $scope.submitted || field.$dirty;
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

    $http.get(url + "/getmyOffers").success(function(offers){
        console.log("go get it.");
        app.offerfinals = offers;
    })

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
        offerItem.timeframe = new Date(offerItem.timeframe);
        console.log(index);
        console.log(offerItem);

        $scope.offer.timeframe = offerItem.timeframe;
        $scope.offer.typeofcare = offerItem.typeofcare;
        $scope.offer.wageperhour = offerItem.wageperhour;
        $scope.offer.supportedarea = offerItem.supportedarea;
        $scope.offer.notes = offerItem.notes;


        $scope.saveUpdate = function(item){
            console.log($scope.Offer.$valid);
            if($scope.Offer.$valid){
                console.log("Saved Changes.");
                offerItem.timeframe = item.timeframe;
                offerItem.typeofcare = item.typeofcare;
                offerItem.wageperhour = item.wageperhour;
                offerItem.supportedarea = item.supportedarea;
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


offerApp.directive("range", function() {
    return {
        restrict: "A",

        require: "ngModel",

        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.range = function(modelValue) {
                if(modelValue<=100 && modelValue>0 || modelValue == null) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
});

offerApp.filter('datetime1', function($filter)
{
    return function(input)
    {
        if(input == null){ return ""; }

        var _date = $filter('date')(new Date(input),
            'MM/dd/yyyy - HH:mm UTC');

        return _date.toUpperCase();

    };
});