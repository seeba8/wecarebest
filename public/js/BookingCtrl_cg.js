/**
 * Created by Layla M on 20.06.2016.
 */
angular.module("myApp")
    .controller("BookingCtrl_cg", ["$scope", "$http", "$window", "user", "auth", function ($scope, $http, $window, user, auth) {

        var app = this;
        var url = 'http://localhost:3000';
        var config = {};
        var result = [];
        $scope.bookingStatuses = {
            0: "",
            1: "Waiting for answer",
            2: "To be paid",
            3: "Ready",
            4: "Cancelled",
            5: "In the past",
            6: "Unbooked Offer"
        };
        $scope.resultsfilter = {};

        $scope.customFilter = function (item) {
            if (typeof $scope.resultsfilter.status != "undefined" && $scope.resultsfilter.status != "") {
                if($scope.resultsfilter.status == "Unbooked Offer" && typeof item.offer._id != "undefined"){
                    return true;
                }
                return item.statustext == $scope.resultsfilter.status;
            }
            else{
                return true;
            }
        };

        $scope.initFirst = function () {
            console.log("BookingCtrl loaded.");
            var caregiver_id = auth.parseJwt(auth.getToken())._id;

            console.log("offers");
            $http.get(url + "/offers", {params: {caregiver: caregiver_id, unbooked: true}}).success(function (offers) {
                console.log(offers.length);
                console.log(offers);
                for(offer in offers){
                    if(offers[offer].offer.createdBy != caregiver_id){
                         console.log("Wrong ID");
                        console.log(offers[offer]);
                        offers[offer] = null;
                     }
                }

                $scope.offers = offers;
            });


            $http.get(url + "/mybookings").success(function (bookings) {


                console.log("Get Bookings...");
                //console.log(bookings);
                //bookings.forEach(statusNumberToText());

                for (booking in bookings) {
                    result[booking] = bookings[booking];
                    bookings[booking] = bookings[booking].booking;
                    bookings[booking].user = result[booking].user;
                }
                console.log(bookings);

                for (booking in bookings) {
                    switch (bookings[booking].status) {
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
                            if (Date.parse(bookings[booking].endtime) < Date.parse(date)) {
                                bookings[booking].statustext = "In the past";

                            } else {
                                bookings[booking].statustext = "Ready";
                            }
                            break;
                        case 4:
                            bookings[booking].statustext = "Cancelled";
                            console.log(status);
                            break;
                    }
                    ;
                }

                $scope.bookings = bookings;
                //console.log(app.offerfinals);
            });
        };


        $scope.changeBookingStatus = function (bookingItem, targetStatus) {
            console.log(targetStatus);
            var data = bookingItem;
            console.log(data);
            data.targetStatus = targetStatus;

            //send it as http post to backend in order to delete it in database
            $http.post("../ChangeBookingStatus", data).success(function () {
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


        $scope.viewOffer = function (id) {
            console.log(id);
            var link = "/#/singleOffer/" + id;
            console.log(link);
            $window.location.href = link;
        }
        /*
         * #############################################################################
         * ##### INVOKED BY CLICK ON DELETE BUTTON IN myoffers.html ####################
         * ##### DELETE DOCUMENT BY ID FROM DATABASE AND ARRAY IN FRONTEND #############
         * #############################################################################
         * */
        $scope.deleteOffer = function (id, index) {
            console.log(index);
            //delete offer from array in frontend.
            $scope.offers.splice(index, 1);

            var data = {};
            data.id = id;
            console.log(data);

            //send it as http post to backend in order to delete it in database
            $http.delete(url + "/offers/:" + data.id).success(function () {
                $scope.ServerResponse = data;
            })
            //IF error in HTTP POST then log it and show to user
                .error(function (data, status, header, config) {
                    $scope.ServerResponse = htmlDecode("Data: " + data +
                        "\n\n\n\nstatus: " + status +
                        "\n\n\n\nheaders: " + header +
                        "\n\n\n\nconfig: " + config);
                });
        };


        //UPDATE FUNCTIONALITY
        $scope.updateOffer = function (offerItem, index) {

            $scope.typeofcares = [
                'Basic',
                'Premium',
                'Full Service'
            ];

            $scope.offers.weekdays = [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ];


            $scope.offers.frequencies = [
                'Weekly',
                'Bi-weekly',
                'Monthly'
            ];


            // $scope.editing = {};
            offerItem.offer.starttime = new Date(offerItem.offer.starttime);
            offerItem.offer.endtime = new Date(offerItem.offer.endtime);
            //console.log(index);
            //console.log(offerItem.offer.location.radius);


            $scope.offers.starttime = offerItem.offer.starttime;
            $scope.offers.endtime = offerItem.offer.endtime;
            $scope.offers.typeofcare = offerItem.offer.typeofcare;
            $scope.offers.wageperhour = offerItem.offer.wageperhour;
            if (offerItem.offer.notes) {
                $scope.offers.notes = offerItem.offer.notes;
            }
            //$scope.offers.location.radius = offerItem.offer.location.radius;
            //$scope.offers.location.name = offerItem.offer.location.name;


            $scope.saveUpdate = function (item) {

                console.log(offerItem.offer);
                console.log(item);
                if ($scope.Offer.$valid) {
                    //item.location = item.center.name;
                    //item.latitude = item.center.latitude;
                    //item.longitude = item.center.longitude;

                    console.log("Saved Changes.");
                    //offerItem.timeframe = item.timeframe;
                    //offerItem.typeofcare = item.typeofcare;
                    console.log(item);
                    offerItem.offer.starttime = item.starttime;
                    offerItem.offer.endtime = item.endtime;
                    offerItem.offer.wageperhour = item.wageperhour;
                    //offerItem.location.name = item.location.name;
                    //offerItem.latitude = item.latitude;
                    //offerItem.longitude = item.longitude;
                    //offerItem.radius = item.radius;
                    offerItem.offer.notes = item.notes;
                    offerItem.offer.id = offerItem.offer._id;
                    console.log
                    app.updateOffer(offerItem);

                } else {
                    console.log("Not valid form.");
                }
            }

        };

        app.updateOffer = function (PushCandidate) {
            $http.put(url + "/offers/:" + PushCandidate.offer.id, PushCandidate.offer).success(function () {
                console.log("Updated successfully");
                $('#myModal').modal('hide');
            })
        };


    }]);


