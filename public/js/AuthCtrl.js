

angular.module("myApp")
    .controller("AuthCtrl", ["$scope", "$http", "$window", "user", "auth", function ($scope, $http, $window, user, auth) {
        var app = this;

        console.log("loaded AuthCtrl");
        if(auth.isAuthed()){
            //console.log(auth.parseJwt(auth.getToken()));
        }

    /*
        app.saveProduct = function(newProduct) {
            $http.post(url + "/add", {name:newProduct}).success(function () {
                loadProducts();
            })
        };*/

        app.isAuthed = function() {
            return auth.isAuthed ? auth.isAuthed() : false
        };

        app.isCaregiver = function() {
            return auth.isCaregiver ? auth.isCaregiver() : false
        };

        app.isCareseeker = function() {
            return auth.isCareseeker ? auth.isCareseeker() : false
        };


        app.logout = function() {
            $window.localStorage.removeItem('jwtToken');
            $window.location.href= "/";
        };

        app.saveUser = function (type, firstName, name, street, city, postalCode, country, phone, gender, email, pwd, pwd2) {
            console.log("clicked register");
            if(pwd==pwd2) {
                $http.post("HTTP://localhost:3000/addUser", {
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
            $http.post("HTTP://localhost:3000/login", {
                email: e,
                pwd: p
            }).success(function(response) {
                //console.log(response);
                auth.saveToken(response.token);
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

        $scope.interacted = function (field) {
            try {
                return $scope.submitted || field.$dirty;
            } catch (e) {
                // throws all kinds of errors. Not interested in them. I think they're connected to the bootstrap datepicker
            }
        };

}]);