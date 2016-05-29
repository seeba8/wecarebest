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
    }

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
    }
    
    app.login = function (email, pwd) {
        $http.post(url + "/login", {
            email: email,
            pwd: pwd
        }).success(function () {
            console.log('success');
        })
    }
    
    

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
})