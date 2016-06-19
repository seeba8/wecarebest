angular.module('myApp').controller('SearchCtrl', ['$scope','$http','$window', "auth", "uiGmapGoogleMapApi", function($scope, $http, $window, auth, uiGmapGoogleMapApi) {
    var app = this;
    var url = 'http://localhost:3000';
    console.log("Loaded Searchcontroller");
    $scope.slider = {
        options: {
            floor: 0,
            ceil: 100
        }
    };
    $scope.searchParams = {
        priceMin: 0,
        priceMax: 100
    };

    $scope.search = {
        template: "searchbox_searchctrl.tpl.html",
        events: {
            place_changed: function (autocomplete) {
                var place = autocomplete.getPlace();
                if (place.address_components) {
                    $scope.map.center = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    $scope.searchParams.lat = place.geometry.location.lat();
                    $scope.searchParams.lng = place.geometry.location.lng();
                    $scope.marker.coords = {
                        latitude: place.geometry.location.lat(),
                        longitude:  place.geometry.location.lng()
                    };
                    $scope.$apply();
                }
            }
        },
        parentDiv: "searchBoxParent",
        options: {
            autocomplete: true,
            componentRestrictions: {country: 'de'} //only works for one country, not multiple codes. remove if necessary
        }
        // position: "top-left"
    };

    uiGmapGoogleMapApi.then(function (maps) {
        geocoder = new maps.Geocoder;
    });

    $scope.marker = {
        options: {draggable: true},
        coords: {
        },
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
                    }
                    , function (results, status) {
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
        zoom: 10,
        options: {
            scaleControl: true,
            mapTypeControl: false,
            streetViewControl: false
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

    app.search = function() {
        var searchParams = $scope.searchParams;
        console.log(searchParams);
        $http.get(url + "/offers",{
            params: searchParams
        }).success(function (offers) {
            console.log("Got Offers.");
            console.log(offers[0]);
            for(var offerID in offers){
                var offer = offers[offerID];
                offer.startday = moment(offer.startday).format("L");
                offer.starttime = moment(offer.starttime).format("LT");
                offer.endtime = moment(offer.endtime).format("LT");
                offer.endday = offer.repeating ? moment(offer.endday).format("L") : "";
            }
            $scope.results = offers;
        });
    };
}]);
