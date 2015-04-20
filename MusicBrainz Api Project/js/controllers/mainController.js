var app = angular.module('musicBrainz', ['ngRoute']);

app.controller("mainController", function ($scope, $http) {

    //initializing variables
    $scope.artists = 0,
        $scope.count = 0,
        $scope.numResults = 0,
        $scope.offset = 0;

    //init function which runs when control is transferred to the controller
    $scope.init = function () {
        console.log("welcome");
        $scope.searchItems = true;
        $scope.info = false;
        $scope.search = {};
        $scope.search.doClick = function (searchText, newOffset) {      //getting text entered in search box and calling search function
            searchText = $(".search-text").val();
            doSearch(searchText, 0);
        };
    };

    //search function
    var doSearch = function (searchText, newOffset) {
        //setting currentUrl variable to music brainz api query
        var currentUrl = "http://musicbrainz.org/ws/2/artist/?query=artist:" + encodeURIComponent(searchText) + "&fmt=json&include=all";
        if (typeof(newOffset) !== "undefined") {
            currentUrl = currentUrl + "&offset=" + newOffset;
        }

        //making ajax call to URL
        var responsePromise = $http.get(currentUrl);

        //ajax call for success
        responsePromise.success(function (response) {
            //setting value of variables based on JSON data
            $scope.artists = response.artists;
            $scope.numResults = $scope.artists.length;
            $scope.offset = response.offset;
            $scope.count = response.count;

            //this function populates artists list
            $scope.artistsInfo = function () {
                var names = new Object();
                for (var i = 0; i < $scope.numResults; i++) {
                    names[i] = $scope.artists[i];
                }
                return names;
            }

            //setting previous and next button to false so that it will not display
            $scope.prev = false;
            $scope.next = false;

            $scope.prevBtn = {};
            $scope.nextBtn = {};

            //if search results are greater than 25 , ie page 1 , show the previous button
            if ($scope.offset >= 25) {
                $scope.prev = true;
                $scope.prevBtn.doClick = function () {
                    doSearch(searchText, $scope.offset - $scope.numResults); //perform search based on new offset value
                }
            }

            else {
                $scope.prev = false;
            }

            //show next button if there are more than 1 pages
            if ($scope.count > 25) {
                //do not show next button if its the last page
                if (($scope.offset + 25) <= $scope.count) {
                    $scope.next = true;
                    $scope.nextBtn.doClick = function () {
                        doSearch(searchText, $scope.offset + $scope.numResults); //show new results based on new offset value
                    }
                }

                else {
                    $scope.next = false;
                }
            }

            else {
                $scope.next = false;
            }

            //get artist details based on artist clicked
            $scope.details = function (artist) {
                $scope.artistDetails = function () {
                    var details = new Object();
                    details[0] = artist;
                    return details;
                }
                $scope.info = true;
                $scope.searchItems = false;

            }

            $scope.info = false;
            $scope.searchItems = true;

            //display detailed results and hide entire artist list
            $scope.back = function () {
                $scope.info = false;
                $scope.searchItems = true;
            }

        });

        //display alert if ajax call is unsuccessful
        responsePromise.error(function (response) {
            alert("Cannot get response from MusicBrainz server");
        });

    }

});



