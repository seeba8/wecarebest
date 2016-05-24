/**
 * Created by MS on 23.05.2016.
 */
var jetbrains = angular.module('jetbrains', []);
    jetbrains.controller('CreateOfferCtrl', ['$scope', '$http', function($scope, $http) {
        var app = this;

        $scope.offer = {};

        app.saveOffer = function () {
            $http.post("../offers", $scope.offer).success(function(){
                console.log("Inserted Successfully");
            })
    }
}]);
