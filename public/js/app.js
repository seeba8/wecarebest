var myApp = angular.module('myApp',['ngRoute','ui.bootstrap.showErrors', 'ngMessages',"uiGmapgoogle-maps", "countrySelect"]);
myApp.config(function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: '../html/partials/home.html' })
            .when('/search', { templateUrl: '../html/partials/search.html' })
            .when('/bookingsrequests', { templateUrl: '../html/myoffers.html' })
            .when('/offerservice', {
                templateUrl: '../html/offerservice.html',
                title: "Offer Service",
                controller: "CreateOfferCtrl"
            })
            .when('/about', { templateUrl: '../html/partials/about.html' })
            .when('/profile', { templateUrl: '../html/partials/profile.html' })
            .when('/login', {templateUrl: '../html/login.html'})
            .when('/addUser', {templateUrl: '../html/registration.html'})
            .when('/myoffers', {templateUrl: '../html/myoffers.html'})
            .when('/contact', {templateUrl: '../html/partials/about.html'})
            .when('/imprint', {templateUrl: '../html/partials/imprint.html'})
            .when('/terms', {templateUrl: '../html/partials/terms.html'})
            .otherwise({ redirectTo: '/'});
    });

myApp.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
    console.log("Hi2");
    showErrorsConfigProvider.showSuccess(true);
}]);

myApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCLOfEshWapwoqrg5qMVjhpG1DB75lvjTE',
        //v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'places'
    });
});

myApp.run(['$templateCache', function ($templateCache) {
    $templateCache.put('searchbox.tpl.html', '<input type="text" class="form-control" id="searchbox" name="supportedarea" ng-model="ngModel" ng-minlength="3" placeholder="Enter city" required>');
    // onkeydown="if(event.keyCode == 13) {event.preventDefault(); event.stopPropagation();}"
}]);

myApp.directive("range", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.range = function(modelValue) {
               return modelValue<=100 && modelValue>0 || modelValue == null;
            }
        }
    };
});

myApp.filter('datetime1', function($filter) {
    return (function(input) {
        if(input == null){ return ""; }
        var _date = $filter('date')(new Date(input),
            'MM/dd/yyyy - HH:mm UTC');
        return _date.toUpperCase();
    });
});


