'use strict';

angular.module('starter.controllers')

    .controller('BrowseCtrl', function (FBURL, $scope, $log, $firebase, $ionicLoading, $ionicPopup, localStorageService, Positions, User) {
        console.log('BrowseCtrl');

        var allPositionsRef = new Firebase(FBURL + 'positions');
        var userId = null;
        var limit = 4;

        $scope.custom = true;

        $ionicLoading.show({template: 'Loading...'});

        Positions.fetchAll(4).then(function (positions) {
            $scope.cards = positions;

            if (positions) {
                $scope.size = parseInt(Object.keys(positions)[0]) + (limit + 1);

                localStorageService.set('card_first_li', $scope.size - getSize(positions) - 1);
                localStorageService.set('card_last_li', $scope.size);
            }

            User.currentUser().then(function (user) {
                userId = user.uid;
                $ionicLoading.hide();
            });
        });

        allPositionsRef.on('child_changed', function (snapshot) {
            document.getElementById('trys_' + snapshot.key()).innerHTML = snapshot.val()['trys'];
            document.getElementById('likes_' + snapshot.key()).innerHTML = snapshot.val()['likes'];
        });

        // load more content
        $scope.loadMoreContent = function () {
            var firstLi = localStorageService.get('card_first_li');
            var first = firstLi - limit;

            Positions.fetchAll(null, first.toString(), firstLi.toString()).then(function (positions) {
                localStorageService.set('card_first_li', first);

                $scope.cards = merge_options(positions, $scope.cards);

                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        // card actions
        $scope.like = false;
        $scope.add = function (key, type) {
            // update user
            var usersRef = new Firebase(FBURL + 'users').child(userId).child('positions').child(key);
            var usersObj = $firebase(usersRef).$asObject();

            usersObj.$loaded().then(function () {
                var dataExists = usersObj.$value !== null;
                if (!dataExists) {
                    if (type === 'trys')  usersRef.set({trys: type === 'trys' ? 1 : 0});
                    if (type === 'likes') {
                        usersRef.set({like: true});
                        $scope.like = true;
                    }
                } else {
                    if (type === 'trys') usersRef.update({trys: usersObj.trys + 1});
                    if (type === 'likes') {
                        usersRef.update({likes: !usersObj.likes});
                        $scope.like = !usersObj.likes;
                    }
                }
            });

            // update positions
            var positionsRef = new Firebase(FBURL + 'positions').child(key);
            var positionObj = $firebase(positionsRef).$asObject();

            positionObj.$loaded().then(function () {
                if (type === 'trys') positionsRef.update({trys: positionObj.trys + 1});
                if (type === 'likes') positionsRef.update({likes: positionObj.likes + ($scope.like === true ? 1 : -1)});
            });

            console.log(key);
            console.log(userId);
        };

        $scope.login = function() {
            $ionicPopup.alert({title: 'Please login!'});
        };

        $scope.share = function () {
            console.log('share');
        };

        function merge_options(obj1, obj2) {
            var obj3 = {};
            for (var attrname in obj1) {
                obj3[attrname] = obj1[attrname];
            }
            for (var attrname in obj2) {
                obj3[attrname] = obj2[attrname];
            }
            return obj3;
        }

        function getSize(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }
    });