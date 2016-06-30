/**
 * Created by Layla M on 27.06.2016.
 */
angular.module("myApp")
    .controller("RateCtrl", ["$scope", "$http", "$window", "auth", "user", "$routeParams", function ($scope, $http, $window, auth, user, $routeParams) {


        var app = this;
        var url = "http://localhost:3000";
        app.overallSatisfaction = 5;
        app.Friendliness = 4;
        app.Competence = 3;
        app.Punctuality = 5;
        app.caregiverid = $routeParams.caregiverid;
        app.bookingid = $routeParams.bookingid;
        console.log("Loaded RateCtrl");

        app.saveRating = function () {
            console.log("clicked: save rating");
            $http.post(url + '/createRating', {
                    caregiver: app.caregiverid,
                    booking: app.bookingid,
                    createdDate: new Date(),
                    otherRemarks: app.otherRemarks,
                    personalFeedback: app.personalFeedback,
                    overallSatisfaction: app.overallSatisfaction,
                    Friendliness: app.Friendliness,
                    Competence: app.Competence,
                    Punctuality: app.Punctuality
                }).success(function () {
                    $window.location.href = "/#/";
                })
        }
    }]);
