angular.module('myApp').controller('SearchCtrl', ['$scope','$http','$window', "auth", function($scope, $http, $window, auth) {
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
