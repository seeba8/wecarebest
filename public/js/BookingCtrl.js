/**
 * Created by Layla M on 20.06.2016.
 */
angular.module("myApp")
    .controller("BookingCtrl", ["$scope", "$http", "$window", "user", "auth", function ($scope, $http, $window, user, auth) {
        var app = this;
        console.log("BookingCtrl loaded.");
        $http.get("HTTP://localhost:3000/mybookings").success(function (bookings) {
            console.log("Get Bookings...");
            console.log(bookings);
            app.bookings = bookings;
            //console.log(app.offerfinals);
        });
    }
    ]);