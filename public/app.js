/**
 * Created by sebas on 15/05/2016.
 */
angular.module("myApp", ['myApp.offers'])

    .config(function($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to /movies
        $urlRouterProvider.otherwise("/offers");

});