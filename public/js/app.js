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
        if(token) {
            /* var params = self.parseJwt(token);
             return Math.round(new Date().getTime() / 1000) <= params.exp;*/
            return true;
        } else {
            return false;
        }
    };

    self.isCaregiver = function() {
        //console.log("in is caregiver");
        if (!self.isAuthed()) {
            return false; //user is currently not logged in
        }
        var token1 = self.getToken();
        //console.log(token1);
        var token = self.parseJwt(token1);
        //console.log(token);
        //console.log(token.type);
        //console.log(token.type == 1);
        return(token.type == 1);
    };

    self.isCareseeker = function() {
        if (!self.isAuthed()) {
            return false; //user is currently not logged in
        }
        var token = self.parseJwt(self.getToken());
        //console.log(token);
        //console.log(token.type);
        //console.log(token.type == 2);
        return(token.type == 2);
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
            .when('/singleOffer', {templateUrl: '../html/singleOffer.html'})
            .when('/mybookingscareseeker', {templateUrl: '../html/mybookingscareseeker.html'})
            .when('/mybookingscaregiver', {templateUrl: '../html/mybookingscaregiver.html'})
            .when('/createRequest', {templateUrl: '../html/createRequest.html'})
            .when('/contact', {templateUrl: '../html/partials/about.html'})
            .when('/imprint', {templateUrl: '../html/partials/imprint.html'})
            .when('/terms', {templateUrl: '../html/partials/terms.html'})
            .otherwise({ redirectTo: '/'});
    });

myApp.factory('authInterceptor', authInterceptor)
    .service('user', userService)
    .service('auth', authService)
    .constant('API', 'http://localhost:3000')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
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


