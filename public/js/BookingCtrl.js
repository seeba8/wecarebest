angular.module('myApp').controller('BookingCtrl', [ '$scope', '$http','$window', "auth", function($scope, $http, $window, auth) {
    var app = this;
    var url = 'http://localhost:3000';
    var config = {};

    console.log("BookingCtrl loaded.");
    
    /*$http.get(url + "/mybookings", config).success(function (bookings) {
        console.log("Get Bookings...");
        console.log(bookings);
        app.bookings = bookings;
        //console.log(app.offerfinals); 
    });*/
    $http({
        method: 'GET',
        url: 'http://localhost:3000/mybookings'
    }).success(function (bookings) {
        console.log("Get Bookings...");
        console.log(bookings);
        app.bookings = bookings;
        //console.log(app.offerfinals);
    });
    
}]);
