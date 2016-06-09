angular.module("myApp").controller("AuthCtrl", ["$scope", "$http", "$window", function ($scope, $http, $window) {
    var app = this;
    var url = "http://localhost:3000";

    console.log("loaded AuthCtrl");
    app.saveProduct = function(newProduct) {
        $http.post(url + "/add", {name:newProduct}).success(function () {
            loadProducts();
        })
    };

    app.saveUser = function (type, firstName, name, street, city, postalCode, country, phone, gender, email, pwd, pwd2) {
        console.log("clicked register");
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
                pwd: pwd,
                pwd2: pwd2
            }).success(function () {
                //loadUsers(); // SECURITY RISK. we cannot just hand out the password hashes etc.
            })}
        else {
            console.log("passwords don't match");
        }
    };

    app.login = function (e, p) {
        $http.post(url + "/login", {
            email: e,
            pwd: p
        }).success(function(response) {
            console.log(response);
            $window.localStorage['jwtToken'] = response.token;
            //$httpProvider.defaults.headers.common["X-AUTH-TOKEN"] = response.data.token;
        });
    };

    //This is a security risk. Not doing it.
    /*function loadUsers() {
        $http.get(url + "/users").success(function (users) {
            app.users = users;
        })
    }*/

}]);
