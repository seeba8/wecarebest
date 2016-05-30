/**
 * Created by MS on 30.05.2016.
 */

var myOffersApp = angular.module('myOffersApp', []);

mybookingsApp.controller('ShowMyOffersCtrl', ['$scope', '$http',  function($scope, $http) {
    var app = this;
    $scope.offers = [{
        timestamp: Date,
        timeframe: Date,
        typeofcare: String,
        wageperhour: Number,
        supportedarea: String,
        notes: String
    }]
}]);
