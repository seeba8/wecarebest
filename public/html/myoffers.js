/**
 * Created by MS on 30.05.2016.
 */

var myOffersApp = angular.module('myOffersApp', []);

myOffersApp.controller('ShowMyOffersCtrl', ['$scope', '$http',  function($scope, $http) {
    var app = this;
    var url = "http://localhost:3000";
    app.recent = true;

    $http.get(url + "/getmyOffers").success(function(offers){
        
        app.offerfinals = offers;
    })

    /*
    * #############################################################################
    * ##### INVOKED BY CLICK ON DELETE BUTTON IN myoffers.html ####################
    * ##### DELETE DOCUMENT BY ID FROM DATABASE AND ARRAY IN FRONTEND #############
    * #############################################################################
    * */
    $scope.deleteOffer = function(id, index) {
        var index = index;

        //delete offer from array in frontend.
        app.offerfinals.splice(index, 1);

        var data = {};
        data.id = id;
        console.log(data);

        //send it as http post to backend in order to delete it in database
        $http.post(url + "/deletemyoffer", data).success(function(){
            console.log("clicked:" + data);
            $scope.PostDataResponse = data;
            console.log("Löschung beendet.");
        })
        //IF error in HTTP POST then log it and show to user
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
                    console.log($scope.ResponseDetails);
            });
    };
    /*
     * #############################################################################
     * ##### INVOKED BY CLICK ON Update BUTTON IN myoffers.html ####################
     * ##### UPDATE DOCUMENT BY ID FROM DATABASE AND ARRAY IN FRONTEND #############
     * #############################################################################
     * */
    $scope.updateOffer = function(offerItem) {

        $scope.editing = {};

        var data = offerItem;
        console.log(data.timeframe);
        $scope.typeofcares = [
            'Basic',
            'Premium',
            'Full Service'
        ];
        data.timeframe = new Date(data.timeframe);
        $scope.offer = data;

        $scope.onChange = function() {
            console.log("oNChange wurde aufgerufen!");
            if ($scope.currentAlbum) {
                $scope.editing.title = $scope.currentAlbum.title;
                $scope.editing.artist = $scope.currentAlbum.artist;
            } else {
                $scope.editing = {};
            }
        };
        
        $scope.cancelUpdate = function(){
            $scope.offer = app.offerfinals;
        }

    };


}]);

myOffersApp.filter('datetime1', function($filter)
{
    return function(input)
    {
        if(input == null){ return ""; }

        var _date = $filter('date')(new Date(input),
            'MM/dd/yyyy - HH:mm UTC');

        return _date.toUpperCase();

    };
});