angular.module("myApp").controller("AuthCtrl", ["$scope", "$http", "$window", function ($scope, $http, $window) {
    var app = this;
    var url = "http://localhost:3000";

    console.log("loaded AuthCtrl");

    app.saveProduct = function(newProduct) {
        $http.post(url + "/add", {name:newProduct}).success(function () {
            loadProducts();
        })
    };

    app.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };


    app.getToken = function() {
        return $window.localStorage['jwtToken'];
    };

    app.isAuthed = function() {
        var token = app.getToken();
        if(token) {
            /* var params = self.parseJwt(token);
             return Math.round(new Date().getTime() / 1000) <= params.exp;*/
            return true;
        } else {
            return false;
        }
    };


    app.saveToken = function(token) {
        $window.localStorage['jwtToken'] = token;
    };

    app.logout = function() {
        $window.localStorage.removeItem('jwtToken');
        $window.location.href= "/";
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
                $window.location.href= "/#/login";
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
            //console.log(response);
            app.saveToken(response.token);
            $window.localStorage['firstname'] = app.parseJwt(response.token).firstname;
            $window.location.href= "/";
            //$httpProvider.defaults.headers.common["X-AUTH-TOKEN"] = response.data.token;
        });
    };

    //This is a security risk. Not doing it.
    /*function loadUsers() {
        $http.get(url + "/users").success(function (users) {
            app.users = users;
        })
    }*/

    console.log(app.isAuthed());

}]);
