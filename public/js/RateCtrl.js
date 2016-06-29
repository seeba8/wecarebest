/**
 * Created by Layla M on 27.06.2016.
 */
angular.module("myApp")
    .controller("RateCtrl", [$scope, $http, $window, auth, user, function($scope, $http, $window, auth, user) {
        var app = this;

        app.overallSatisfaction = 5;
        app.Friendliness = 4;
        app.Competence = 3;
        app.Punctuality = 5;

        console.log("Loaded RateCtrl");

        app.rateFunction = function(rating) {
            console.log('Rating selected: ' + rating);
        };

        app.saveRating = function(caregiver, otherRemarks, personalFeedback, overallSatisfaction, Friendliness, Competence, Punctuality){
            console.log("clicked: save rating");
            $http.post(url + '/createRating', {
                    caregiver : caregiver,
                    createdDate : new Date(),
                    otherRemarks : otherRemarks,
                    personalFeedback : personalFeedback,
                    overallSatisfaction : overallSatisfaction,
                    Friendliness : Friendliness,
                    Competence : Competence,
                    Punctuality : Punctuality
                }.success(function () {
                    $window.location.href= "/#/";
                })
            )
        }
    }])

    .directive ('starRating', function() {
        return {
            restrict: 'EA',
            template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
            '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
            '    <i class="fa fa-star"></i>' + // or &#9733
            '  </li>' +
            '</ul>',
            scope: {
                ratingValue: '=ngModel',
                max: '=?', // optional (default is 5)
                onRatingSelect: '&?',
                readonly: '=?'
            },
            link: function (scope, element, attributes) {
                if (scope.max == undefined) {
                    scope.max = 5;
                }
                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };
                scope.toggle = function (index) {
                    if (scope.readonly == undefined || scope.readonly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelect({
                            rating: index + 1
                        });
                    }
                };
                scope.$watch('ratingValue', function (oldValue, newValue) {
                    if (newValue) {
                        updateStars();
                    }
                });
            }
        };
    })

