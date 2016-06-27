/**
 * Created by sebas on 27/06/2016.
 */

angular.module("myApp")
    .controller("CreateRequestCtrl", ["$scope", "$routeParams", "$http", "$window", "user", "auth", "uiGmapGoogleMapApi", function ($scope, $routeParams, $http, $window, user, auth, uiGmapGoogleMapApi) {

        var geocoder;
        var app = this;
        var url = 'http://localhost:3000';

        function submit() {
            $http.post(url + "/createRequest", $scope.request).success(function () {
                console.log("...Inserted Successfully!");
                $window.location.href = "/#/bookingsrequests";
            })
        }

        if (typeof $routeParams.offerid == "undefined") {
            $window.location = "/";
        }
        $scope.request = {
            offerid: $routeParams.offerid,
            startday: $routeParams.startday,
            starttime: $routeParams.starttime,
            endtime: $routeParams.endtime,
            location: {}
        };

        $http.get(url + "/offers", {
            params: {_id:$routeParams.offerid}
        }).success(function (offers) {
            console.log("Got Offers.");
            console.log(offers);
            for (var offerID in offers) {
                var offer = offers[offerID].offer;
                offer.startday = moment(offer.startday).format("L");
                offer.starttime = moment(offer.starttime).format("LT");
                offer.endtime = moment(offer.endtime).format("LT");
                offer.repeatoptions.endday = offer.repeating ? moment(offer.repeatoptions.endday).format("L") : "";
                offer.createdDate = offer.createdDate ? moment(offer.createdDate).format("L") : moment("2016 01 01", "YYYY MM DD").format("L");
            }
            offer = offers[0].offer;
            $scope.request = {
                offerid: $routeParams.offerid,
                startday: $routeParams.startday || offer.startday,
                starttime: $routeParams.starttime || offer.starttime,
                endtime: $routeParams.endtime || offer.endtime,
                location: {}
            };

            /*if(offer.endday) $('.startdaypicker').data("DateTimePicker").maxDate(moment(offer.endday));
            $('.startdaypicker').data("DateTimePicker").minDate(moment(offer.startday));
            if(offer.endday) $('.enddaypicker').data("DateTimePicker").maxDate(moment(offer.endday));
            $('.enddaypicker').data("DateTimePicker").minDate(moment(offer.startday));*/
        });
        updateMap = function(){
            console.log("ASKING GOOOGLE");
            geocoder.geocode({
                "address": $scope.request.location.street + ", " + $scope.request.location.postalCode + " " +
                $scope.request.location.city
            }, function (results, status) {
                console.log(results);
                if (status == "OK" && results != null) {
                    $scope.request.location.latitude = results[0].geometry.location.lat();
                    $scope.request.location.longitude = results[0].geometry.location.lng();
                    $scope.map.center = $scope.request.location;
                    $scope.marker.coords = $scope.map.center;
                    $scope.$apply();
                }
            });
        };

        $(function () {
            $('.startdaypicker').datetimepicker({
                format: "L",
                minDate: moment(),
                useCurrent: false //Important! See issue #1075
            })
                .on('dp.change', function (e) {
                    $('.enddaypicker').data("DateTimePicker").minDate(e.date);
                    $scope.request.startday = e.date.toDate();
                    $scope.$apply();
                });
        });

        $(function () {
            $('.starttimepicker').datetimepicker({
                format: "LT"
            })
                .on('dp.change', function (e) {
                    $scope.request.starttime = e.date.toDate();
                    $scope.$apply();
                });
        });

        $(function () {
            $('.endtimepicker').datetimepicker({
                format: "LT"
            })
                .on('dp.change', function (e) {
                    $scope.request.endtime = e.date.toDate();
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
                    $scope.request.repeatoptions.endday = e.date.toDate();
                    $scope.$apply();
                });
        });



        if (typeof $routeParams.offerid == "undefined") {
            $window.location = "/";
        }

        uiGmapGoogleMapApi.then(function (maps) {
            geocoder = new maps.Geocoder;
        });


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


        $('.startdaypicker').data("DateTimePicker").defaultDate($scope.request.startday);
        $('.starttimepicker').data("DateTimePicker").defaultDate($scope.request.startday);
        $('.endtimepicker').data("DateTimePicker").defaultDate($scope.request.startday);


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
                    $scope.request.location.latitude = e.latLng.lat();
                    $scope.request.location.longitude = e.latLng.lng();
                    $scope.marker.coords = {
                        latitude: e.latLng.lat(),
                        longitude: e.latLng.lng()
                    };

                    geocoder.geocode({
                            "location": {
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng()
                            }
                        }
                        , function (results, status) {
                            if (status == "OK" && results != null){
                                $scope.request.location.city = "";
                                $scope.request.location.street = "";
                                $scope.request.location.postalCode = "";
                                console.log(results[0]);
                                for(var i = 0; i < results[0].address_components.length; i++){
                                    var component = results[0].address_components[i];
                                    if(component["types"].indexOf("street_number") > -1) {
                                        $scope.request.location.street += " " + component.long_name;
                                    }
                                    else if(component["types"].indexOf("route") > -1) {
                                        $scope.request.location.street = component.long_name + " " + $scope.request.location.street;
                                    }
                                    else if(component["types"].indexOf("locality") > -1) {
                                        $scope.request.location.city = component.long_name;
                                    }
                                    else if(component["types"].indexOf("postal_code") > -1) {
                                        $scope.request.location.postalCode = component.long_name;
                                    }
                                }
                                $scope.$apply();
                            }
                        }
                    );
                    $scope.$apply();
                }
            }
        };
        $scope.marker = {
            options: {draggable: true, clickable: false},
            coords: {},
            events: {
                dragend: function (marker, eventName, args) {
                    $scope.request.location.latitude = marker.position.lat();
                    $scope.request.location.longitude = marker.position.lng();
                    geocoder.geocode({
                            "location": {
                                lat: marker.position.lat(),
                                lng: marker.position.lng()
                            }
                        }, function (results, status) {
                            if (status == "OK" && results != null) {
                                console.log(results[0]);
                                for(var i = 0; i < results[0].address_components.length; i++){
                                    var component = results[0].address_components[i];
                                    if(component["types"].indexOf("street_number") > -1) {
                                        $scope.request.location.street += " " + component.long_name;
                                    }
                                    else if(component["types"].indexOf("route") > -1) {
                                        $scope.request.location.street = component.long_name + " " + $scope.request.location.street;
                                    }
                                    else if(component["types"].indexOf("locality") > -1) {
                                        $scope.request.location.city = component.long_name;
                                    }
                                    else if(component["types"].indexOf("postal_code") > -1) {
                                        $scope.request.location.postalCode = component.long_name;
                                    }
                                }
                                $scope.$apply();
                            }
                        }
                    );
                }
            }
        };

    }]);