


angular.module('myApp').controller('BookingCtrl', [ '$scope', '$http','$window', "auth", function($scope, $http, $window, auth) {
    var app = this;
    var url = 'http://localhost:3000';
    var config = {};

    console.log("BookingCtrl loaded.");

    $http.get(url + "/mybookings", config).success(function (bookings) {
        console.log("Get Bookings...");
        console.log(bookings);
        app.bookings = bookings;
        //console.log(app.offerfinals);
    });
    /*$http({
     method: 'GET',
     url: 'http://localhost:3000/mybookings'
     }).success(function (bookings) {
     console.log("Get Bookings...");
     console.log(bookings);
     app.bookings = bookings;
     //console.log(app.offerfinals);
     });*/

}]);

angular.module('myApp').controller('CreateRequestCtrl', [ '$scope', '$http','$window', "auth", function($scope, $http, $window, auth) {
    var app = this;
    var url = 'http://localhost:3000';
    var config = {};

    console.log("CreateRequestCtrl loaded.");

    $http.get(url + "/mybookings", config).success(function (bookings) {
        console.log("Get Bookings...");
        console.log(bookings);
        app.bookings = bookings;
        //console.log(app.offerfinals);
    });
    app.saveRequest = function (type, firstName, name, street, city, postalCode, country, phone, gender, email, pwd, pwd2) {
        console.log("clicked register");
        $http.post("HTTP://localhost:3000/mybookings", {
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
            pwd: pwd,
            pwd2: pwd2
        }).success(function () {
            //loadUsers(); // SECURITY RISK. we cannot just hand out the password hashes etc.
            $window.location.href= "/#/";
        })
    };
    /*    app.saveRequest = function() {
     $http({
     method: 'GET',
     url: 'http://localhost:3000/mybookings'

     }).success(function (bookings) {
     console.log("Get Bookings...");
     console.log(bookings);
     app.bookings = bookings;
     //console.log(app.offerfinals);
     });
     }*/

}]);
