/**
 * Created by sebas on 15/05/2016.
 */
var jetbrains = angular.module("jetbrains", []);
jetbrains.controller("AppCtrl", function ($http) {
    var app = this;
    var url = "http://localhost:3000";
    app.saveProduct = function(newProduct) {
        $http.post(url + "/add", {name:newProduct}).success(function () {
            loadProducts();
        })
    };

    app.saveUser = function (type, firstName, name, street, city, postalCode, country, phone, gender, email, pwd) {
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
        })
    };
    
/*    app.login = function (e, p) {
        $http.post(url + "/login", {
            email: e,
            pwd: p
        }).then(function(response) {
            $httpProvider.defaults.headers.common["X-AUTH-TOKEN"] = response.data.token;
        });
    };*/

    app.login = function(user) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/login', user).then(function(result) {
                if (result.data.success) {
                    storeUserCredentials(result.data.token);
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
    
    

    function loadProducts() {
        $http.get(url).success(function (products) {
            app.products = products;
        })
    }

    function loadUsers() {
        $http.get(url + "/users").success(function (users) {
            app.users = users;
        })
    }

    loadProducts();
    loadUsers();
});