/**
 * Created by Layla M on 20.06.2016.
 */
angular.module("myApp")
    .controller("BookingCtrl_cg", ["$scope", "$http", "$window", "user", "auth", function ($scope, $http, $window, user, auth) {

         var app = this;
         var url = 'http://localhost:3000';
         var config = {};
         var result = [];

            $scope.initFirst=function()
            {
                console.log("BookingCtrl loaded.");
                var caregiver_id = auth.parseJwt(auth.getToken())._id;

                console.log("offers");
                $http.get(url + "/offers", {params:{caregiver: caregiver_id, unbooked: true}}).success(function (offers) {
                    console.log(offers.length);
                    console.log(offers);
                    $scope.offers = offers;
                });
                
                
                $http.get(url + "/mybookings").success(function (bookings) {


                    console.log("Get Bookings...");
                    //console.log(bookings);
                    //bookings.forEach(statusNumberToText());

                    for(booking in bookings){
                        result[booking] = bookings[booking];
                        bookings[booking] = bookings[booking].booking;
                        bookings[booking].user = result[booking].user;
                    }
                    console.log(bookings);

                    for(booking in bookings){
                        switch(bookings[booking].status) {
                            case 1:
                                bookings[booking].statustext = "Waiting for answer";
                                console.log(status);
                                break;
                            case 2:
                                bookings[booking].statustext = "To be paid";
                                console.log(status);
                                break;
                            case 3:
                                var date = new Date();
                                if(Date.parse(bookings[booking].endtime) < Date.parse(date)  ){
                                    bookings[booking].statustext = "In the past";

                                } else {
                                    bookings[booking].statustext = "Ready";
                                }
                                break;
                            case 4:
                                bookings[booking].statustext = "Cancelled";
                                console.log(status);
                                break;
                        };
                    }

                    $scope.bookings = bookings;
                    //console.log(app.offerfinals);
                });
            };


            $scope.changeBookingStatus = function(bookingItem, targetStatus){
                console.log(targetStatus);
                var data = bookingItem;
                console.log(data);
                data.targetStatus = targetStatus;

                //send it as http post to backend in order to delete it in database
                $http.post("../ChangeBookingStatus",  data).success(function () {
                    console.log("CancelUpdate successfull");
                    $scope.initFirst();
                })
                //IF error in HTTP POST then log it and show to user
                    .error(function (data, status, header, config) {
                        $scope.ResponseDetails = "Data: " + data +
                            "<hr />status: " + status +
                            "<hr />headers: " + header +
                            "<hr />config: " + config;
                        console.log($scope.ResponseDetails);
                    });
            }





        /*
         * #############################################################################
         * ##### INVOKED BY CLICK ON DELETE BUTTON IN myoffers.html ####################
         * ##### DELETE DOCUMENT BY ID FROM DATABASE AND ARRAY IN FRONTEND #############
         * #############################################################################
         * */
        $scope.deleteOffer = function(id, index) {
            console.log(index);
            //delete offer from array in frontend.
            $scope.offers.splice(index, 1);

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


        //UPDATE FUNCTIONALITY
        $scope.updateOffer = function(offerItem, index) {

            // $scope.editing = {};
            offerItem.startDay = new Date(offerItem.startDay);
            console.log(index);
            console.log(offerItem);

            $scope.offer.startDay = offerItem.startDay;
            $scope.offer.typeofcare = offerItem.typeofcare;
            $scope.offer.wageperhour = offerItem.wageperhour;
            $scope.offer.location = offerItem.location;
            $scope.offer.notes = offerItem.notes;


            $scope.saveUpdate = function(item){

                console.log($scope.Offer.$valid);
                console.log($scope.offer);
                console.log(item);
                if($scope.Offer.$valid){
                    item.location = item.center.name;
                    item.latitude = item.center.latitude;
                    item.longitude = item.center.longitude;

                    console.log("Saved Changes.");
                    offerItem.timeframe = item.timeframe;
                    offerItem.typeofcare = item.typeofcare;
                    offerItem.wageperhour = item.wageperhour;
                    offerItem.location.name = item.location.name;
                    offerItem.latitude = item.latitude;
                    offerItem.longitude = item.longitude;
                    offerItem.radius = item.radius;
                    offerItem.notes = item.notes;
                    offerItem.id = offerItem._id;
                    app.updateOffer(offerItem);

                } else {
                    console.log("Not valid form.");
                }
            }

        };

        app.updateOffer = function ( PushCandidate) {
            $http.post("../updatemyoffer",  PushCandidate).success(function () {
                console.log("Updated successfully");
            })
        };







    }]);


