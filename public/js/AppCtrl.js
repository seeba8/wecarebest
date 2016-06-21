/**
 * Created by sebas on 07/06/2016.
 */

/* NOT USED AT THE MOMENT!!!! */
angular.module("myApp").controller("AppCtrl",["$scope", "$http", "$window", function($scope, $http, $window) {

    var app = this;


    app.updateProfile = function(){
        console.log("hi");
        var f = document.getElementById('profilepicture').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            var data = e.target.result;
            $http.put("/users", {picture: data}).success(function(res){
                $window.location = "/";
            });
        };
        r.readAsDataURL(f);
    }
}]);
