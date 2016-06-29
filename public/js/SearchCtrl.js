angular.module('myApp').controller('SearchCtrl', ['$scope', "$routeParams", '$http', '$window', "auth", "uiGmapGoogleMapApi", "geolocation", function ($scope, $routeParams, $http, $window, auth, uiGmapGoogleMapApi, geolocation) {
    var app = this;
    var url = 'http://localhost:3000';
    console.log("Loaded Searchcontroller");
    var isSingleOffer = false;
    $scope.search = {advanced: true};
    $scope.showMap = true;
    geolocation.getLocation().then(function(data){
        $scope.searchParams.lat = data.coords.latitude;
        $scope.searchParams.lng = data.coords.longitude;
        $scope.marker.coords = {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
        };
        $scope.map.center = $scope.marker.coords;
        geocoder.geocode({
                "location": {
                    lat: data.coords.latitude,
                    lng: data.coords.longitude
                }
            }, function (results, status) {
                if (status == "OK" && results != null) {
                    $('#searchbox').val(results[0].formatted_address);

                }
            }
        );
    });

    app.reset = function () {
        $scope.searchParams = {
            priceMin: 0,
            priceMax: 100
        };

    };
    app.reset();

    app.search = function () {
        console.log("clicked");
        var searchParams = $scope.searchParams;
        $http.get(url + "/offers", {
            params: searchParams
        }).success(function (offers) {
            console.log("Got Offers.");
            console.log(offers);
            for (var offerID in offers) {
                var offer = offers[offerID].offer;
                offer.startday = moment(offer.startday).format("L");
                offer.starttime = moment(offer.starttime).format("LT");
                offer.endtime = moment(offer.endtime).format("LT");
                offer.endday = offer.repeating ? moment(offer.endday).format("L") : "";
                offer.createdDate = offer.createdDate ? moment(offer.createdDate).format("L") : moment("2016 01 01", "YYYY MM DD").format("L");
                offers[offerID].user.picture = offers[offerID].user.picture || "../images/clint.jpg"
            }
            $scope.results = offers;
            if(isSingleOffer){
                $scope.map.center = $scope.results[0].offer.location;
                $scope.circle.center = $scope.results[0].offer.location;
                $scope.circle.radius = $scope.results[0].offer.location.radius;
                $('#caregiverimg').attr("src", $scope.results[0].user.picture);
                console.log("get short rating");
                $http.post(url + "/shortRating", {
                        caregiver: $scope.results[0].offer.createdBy
                    }).success(function(shortRatings) {
                        console.log(shortRatings);
                        $scope.overallSatisfaction = shortRatings.overallSatisfaction;
                        $scope.Friendliness = shortRatings.Friendliness;
                        $scope.Competence = shortRatings.Competence;
                        $scope.Punctuality = shortRatings.Punctuality;

                    });
                $http.post(url + "/longRating", {
                    caregiver : $scope.results[0].offer.createdBy
                }).success(function(longratings) {
                    console.log("long ratings successful");
                    console.log(longratings);
                    $scope.ratings = longratings;

                });

            }
        });
    };
    

    $(function () {
        $('.startdaypicker').datetimepicker({
            format: "L",
            minDate: moment(),
            useCurrent: false
        })
            .on('dp.change', function (e) {
                $scope.searchParams.startday = e.date.toDate();
                $scope.$apply();
            });
    });
    $(function () {
        $('.starttimepicker').datetimepicker({
            format: "LT",
            useCurrent: false
        })
            .on('dp.change', function (e) {
                $scope.searchParams.starttime = e.date.toDate();
                $scope.$apply();
            });
    });
    $(function () {
        $('.endtimepicker').datetimepicker({
            format: "LT",
            useCurrent: false
        })
            .on('dp.change', function (e) {
                $scope.searchParams.endtime = e.date.toDate();
                $scope.$apply();
            });
    });

    
    
    if (typeof $routeParams.offerid !== "undefined") {
        isSingleOffer = true;
        console.log("Show single offer:", $routeParams.offerid);
        $scope.searchParams = {
            _id: $routeParams.offerid
        };
        app.search();
    }


    $scope.slider = {
        options: {
            floor: 0,
            ceil: 100
        }
    };

    $scope.search = {
        template: "searchbox_searchctrl.tpl.html",
        events: {
            place_changed: function (autocomplete) {
                var place = autocomplete.getPlace();
                $scope.searchParams.locationname = place.formatted_address;
                if (place.address_components) {
                    $scope.map.center = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    $scope.searchParams.lat = place.geometry.location.lat();
                    $scope.searchParams.lng = place.geometry.location.lng();
                    $scope.marker.coords = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    $scope.$apply();
                }
            }
        },
        parentDiv: "searchBoxParent",
        options: {
            autocomplete: true,
            visible: true,
            componentRestrictions: {country: 'de'} //only works for one country, not multiple codes. remove if necessary
        }
        // position: "top-left"
    };
    uiGmapGoogleMapApi.then(function (maps) {
        geocoder = new maps.Geocoder;
        app.maps = maps;

    });



    $scope.$watch("search.advanced", function() {
        console.log("advanced");

        if(typeof app.maps != "undefined"){
            console.log($scope.map.control.getGMap());
            //app.maps.event.trigger($scope.map.control.getGMap(),'resize');
            setTimeout(function () {
                app.maps.event.trigger($scope.map.control.getGMap(),'resize');
            }, 50);
        }

    });
    
    $scope.marker = {
        options: {draggable: true},
        coords: {},
        events: {
            dragend: function (marker, eventName, args) {
                console.log(marker);
                $scope.searchParams.lat = marker.position.lat();
                $scope.searchParams.lng = marker.position.lng();
                geocoder.geocode({
                        "location": {
                            lat: marker.position.lat(),
                            lng: marker.position.lng()
                        }
                    }, function (results, status) {
                        if (status == "OK" && results != null) {
                            $('#searchbox').val(results[0].formatted_address);

                        }
                    }
                );
            }
        }
    };


    $scope.map = {
        center: {
            latitude: 48.1,
            longitude: 11.5,
            name: "München"
        },
        control: {},
        zoom: 10,
        options: {
            scaleControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            refresh: false
        },
        events: {
            click: function (mapModel, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                $scope.searchParams.lat = e.latLng.lat();
                $scope.searchParams.lng = e.latLng.lng();
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
                        if (status == "OK" && results != null) {
                            $('#searchbox').val(results[0].formatted_address);
                        }
                    }
                );
                $scope.$apply();
            }
        }
    };


    $scope.circle = {
        stroke: {
            color: '#428BCA',
            weight: 2,
            opacity: 1
        },
        fill: {
            color: '#428BCA',
            opacity: 0.2
        },
        geodesic: true, // optional: defaults to false
        draggable: true, // optional: defaults to false
        clickable: true, // optional: defaults to true
        editable: true, // optional: defaults to false
        visible: true, // optional: defaults to true
        control: {}
    };

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



}]);
