angular.module('myApp',['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: '../html/partials/home.html' })
            .when('/search', { templateUrl: '../html/partials/search.html' })
            .when('/bookingsrequests', { templateUrl: '../html/partials/bookingsrequests.html' })
            .when('/offerservice', { templateUrl: '../html/offerservice.html', controller: "CreateOfferCtrl" })
            .when('/about', { templateUrl: '../html/partials/about.html' })
            .when('/profile', { templateUrl: '../html/partials/profile.html' })
            .otherwise({ redirectTo: '/'});
    });
/*
    .controller('ArticlesCtrl', function($scope){

    });*/
