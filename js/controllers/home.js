'use strict';

angular.module('starter.controllers')

    .controller('HomeCtrl', function (FBURL, $scope, $log, $firebase, $ionicLoading, $ionicPopup, localStorageService, Positions, User, $ionicSlideBoxDelegate) {
        console.log('HomeCtrl');

        var allPositionsRef = new Firebase(FBURL + 'positions');
        var userId = null;
        var limit = 4;

        $scope.custom = true;

        $ionicLoading.show({template: 'Loading...'});

        Positions.fetchAll().then(function (positions) {
            $scope.cards = positions;

            $ionicSlideBoxDelegate.update();

            User.currentUser().then(function (user) {
                userId = user.uid;
                $ionicLoading.hide();
            });
        });

        $scope.onSwipe = function(swipe){
          console.log(swipe);
          console.log('swipe');
        };

        allPositionsRef.on('child_changed', function (snapshot) {
            document.getElementById('trys_' + snapshot.key()).innerHTML = snapshot.val()['trys'];
            document.getElementById('likes_' + snapshot.key()).innerHTML = snapshot.val()['likes'];
        });

    });