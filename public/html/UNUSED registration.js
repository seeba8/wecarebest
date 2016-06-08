/**
 * Created by Layla M on 03.06.2016.
 */

var jetbrains = angular.module("jetbrains", []);
jetbrains.controller("AppCtrl", function ($http) {

    var app = this;
    var url = "http://localhost:3000";

    app.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
        showErrorsConfigProvider.showSuccess(true);
    }]);

    app.controller('CreateAuthCtrl', ['$interval', '$scope', '$http',  function($interval, $scope, $http) {
        var app = this;
        var url = 'http://localhost:3000';

        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }}
            ;

        // $scope.onlyNumbers = /^[0-9]+$/;

        $scope.submitted = false;
        $scope.submit = function() {
            // Trigger validation flag. True because user clicked on submit.
            $scope.submitted = true;
            $scope.errormessages = null;
            
            //Clicked to submit registration
            
            console.log($scope.app.$valid)

            app.saveUser = function (type, firstName, name, street, city, postalCode, country, phone, gender, email, pwd, pwd2) {
                if(pwd==pwd2) {
                    $http.post(url + "/addUser", {
                        type: type,
                        firstName: firstName,
                        name: name,
                        street: street,
                        city: city,
                        postalCode: postalCode,
                        country: country,
                        phone: phone,
                        gender: gender,
                        email: email,
                        pwd: pwd
                    }).success(function () {
                        loadUsers();
                    })}
                else {
                    console.log("passwords don't match");
                }
            };
        };

        $scope.interacted = function(field) {
            return $scope.submitted || field.$dirty;
        };
    }]);

});

