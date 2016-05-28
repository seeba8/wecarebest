/**
 * Created by MS on 23.05.2016.
 */
var jetbrains = angular.module('jetbrains', ['ui.bootstrap.showErrors', 'ngMessages']);

jetbrains.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
    showErrorsConfigProvider.showSuccess(true);
}]);

jetbrains.controller('CreateOfferCtrl', ['$scope', '$http',  function($scope, $http) {
    var app = this;

    $scope.offer = {};
    $scope.onlyNumbers = /^[0-9]+$/;

    $scope.typeofcares = [
        'Basic',
        'Premium',
        'Full Service'
        ];

    $scope.submitted = false;
    $scope.submit = function() {
        console.log("Clicked Submit Offer...");
        if($scope.Offer.$valid){
            console.log("Form is valid. Insert it...")
            $http.post("../offers", $scope.offer).success(function(){
                console.log("...Inserted Successfully!");
            });
        } else {
            console.log("...Form not valid.")
        }
        $scope.submitted = true;
    };

    $scope.interacted = function(field) {
        return $scope.submitted || field.$dirty;
    };


}]);

jetbrains.directive("range", function() {
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
