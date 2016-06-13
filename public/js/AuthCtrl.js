function authInterceptor(API, auth) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getToken();
            if(token) {
                config.headers.Authorization = 'JWT ' + token;
            }

            return config;
        },

        // If a token was sent back, save it
        response: function(res) {
            if(res.data.token) {
                auth.saveToken(res.data.token);
            }
            return res;
        }
    }
}

function authService($window) {
    var self = this;
    self.getToken = function() {
        return $window.localStorage['jwtToken'];
    };

    self.isAuthed = function() {
        var token = self.getToken();
        //console.log(token);
        //console.log(token==true);
        if(token==true) {
            //console.log("in der If-Abfrage");
            /* var params = self.parseJwt(token);
             return Math.round(new Date().getTime() / 1000) <= params.exp;*/
            return true;
        } else {
            return false;
        }
    };

    self.saveToken = function(token) {
        $window.localStorage['jwtToken'] = token;
    };

    self.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };
    // Add JWT methods here

}

function userService($http, API, auth) {
    var self = this;


    // add authentication (user) methods here

}

angular.module("myApp")
    .factory('authInterceptor', authInterceptor)
    .service('user', userService)
    .service('auth', authService)
    .constant('API', 'http://localhost:3000')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })

    .controller("AuthCtrl", ["$scope", "$http", "$window", "user", "auth", function ($scope, $http, $window, user, auth) {
        var app = this;

        console.log("loaded AuthCtrl");
        if(auth.isAuthed()){
            console.log(auth.parseJwt(auth.getToken()));
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