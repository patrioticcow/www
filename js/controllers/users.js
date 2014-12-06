'use strict';

angular.module('starter.controllers')

    .controller('UsersCtrl', function (FBURL, $scope, $log, $firebase, $ionicLoading, localStorageService, User) {
        console.log('UsersCtrl');

        $ionicLoading.show({template: 'Loading...'});

        var limit = 8;

        $scope.users = true;

        // get initial users
        User.fetchAll(limit).then(function (users) {
            $scope.users = users;
            console.log(users);

            if (users) {
                var nr = parseInt(Object.keys(users)[0].replace("simplelogin:", ""));
                $scope.size = nr + (limit + 1);

                localStorageService.set('first_user_li', "simplelogin:" + ($scope.size - getSize(users) - 1));
                localStorageService.set('last_user_li', "simplelogin:" + $scope.size);
            }

            $ionicLoading.hide();
        });

        // load more users
        // TODO make sure fetch all has the proper limit
        $scope.loadMoreUsers = function () {
            var firstLi = localStorageService.get('first_user_li');
            var first = parseInt(firstLi.replace("simplelogin:", "")) - limit;

            User.fetchAll(null, first.toString(), firstLi.toString()).then(function (users) {
                localStorageService.set('first_user_li', first);

                $scope.users = merge_options(users, $scope.users);

                $scope.$broadcast('scroll.refreshComplete');
            });
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

