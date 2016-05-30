/**
 * Created by MS on 23.05.2016.
 */
var offerApp = angular.module('offerApp', ['ui.bootstrap.showErrors', 'ngMessages']);

offerApp.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
    showErrorsConfigProvider.showSuccess(true);
}]);

offerApp.controller('CreateOfferCtrl', ['$scope', '$http',  function($scope, $http) {
    var app = this;
    var url = 'http://localhost:3000';

    $scope.offer = {};
    data = $scope.offer;

    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }

    $scope.onlyNumbers = /^[0-9]+$/;

    $scope.typeofcares = [
        'Basic',
        'Premium',
        'Full Service'
        ];

    $scope.submitted = false;
    $scope.submit = function() {
        // Trigger validation flag. True because user clicked on submit.
        $scope.submitted = true;
        $scope.errormessages = null;

        console.log("Clicked Submit Offer...");

        //Validate form input. If fine then send data via HTTP POST to server. Otherwise show error.
        if($scope.Offer.$valid){
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
