/**
 * Created by MS on 23.05.2016.
 */
var jetbrains = angular.module('jetbrains', ["uiGmapgoogle-maps"]);
jetbrains.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCLOfEshWapwoqrg5qMVjhpG1DB75lvjTE',
        //v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'places'
    });
});
jetbrains.run(['$templateCache', function ($templateCache) {
    $templateCache.put('searchbox.tpl.html', '<input type="text" class="form-control" id="searchbox" onkeydown="if (event.keyCode == 13) {event.preventDefault(); event.stopPropagation();}" placeholder="Enter city">');
}]);
jetbrains.controller('CreateOfferCtrl', ['$scope', '$http', function ($scope, $http) {
    var app = this;

    $scope.offer = {};
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

    app.saveOffer = function () {
        $http.post("../offers", $scope.offer).success(function () {
            console.log("Inserted Successfully");
        })
    }
}]);

