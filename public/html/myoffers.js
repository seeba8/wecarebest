/**
 * Created by MS on 30.05.2016.
 */

var myOffersApp = angular.module('myOffersApp', []);

myOffersApp.controller('ShowMyOffersCtrl', ['$scope', '$http',  function($scope, $http) {
    var app = this;
    var url = "http://localhost:3000";

    $http.get(url + "/getmyOffers").success(function(offers){
        app.offers = offers;
    })

    $scope.deleteOffer = function(id, index) {
        var index = index;
        app.offers.splice(index, 1);

        var data = {};
        data.id = id;
        console.log(data);
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
    $scope.offers = [
        {
            timestamp: "test",
            timeframe: "test2",
            typeofcare: "Basic",
            wageperhour: 12,
            supportedarea: "abcdefgh"
        },
        {
            timestamp: "test",
            timeframe: "test2",
            typeofcare: "Basic",
            wageperhour: 12,
            supportedarea: "abcdefgh"
        }



    ]*/
}]);
