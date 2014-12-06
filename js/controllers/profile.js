'use strict';

angular.module('starter.controllers')

    .controller('ProfileCtrl', function ($http, $scope, $stateParams, $ionicLoading, $timeout, Auth, User) {
        console.log('ProfileCtrl');

        $ionicLoading.show({template: 'Loading...'});

        var mImage = 'http://placekitten.com/g/350';
        var sImage = 'http://placekitten.com/g/40';

        $scope.isLoggedin = localStorage['position.uid'] === $stateParams.userId;
        $scope.userImage = mImage;
        $scope.userSmallImage = sImage;
        $scope.data = {};

        $scope.changeAbout = function () {
            console.log($scope.data);

            User.ref().child($stateParams.userId).update({description: $scope.data.description});
        };

        // image
        var imageLoader = document.getElementById('imageLoader');
        imageLoader.addEventListener('change', handleImage, false);

        User.findById($stateParams.userId).then(function (user) {
            $scope.user = user;

            if (user === null) {
                Auth.logout().then(function () {
                    $scope.isLoggedin = false;
                    window.location = '/';
                });
            } else {
                console.log(user);
                $scope.data = {description: user.description};
                // user image
                $scope.userImage = user.image || mImage;
                $scope.userSmallImage = user.smallImage || sImage;

                $ionicLoading.hide();
            }
        });

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    var MAX_WIDTH = 40;
                    var MAX_HEIGHT = 40;
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    var canvas = document.getElementById("myCanvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    var dataurl = canvas.toDataURL();

                    $scope.userImage = img.src;
                    $scope.userSmallImage = dataurl;

                    User.ref().child($stateParams.userId).update({smallImage: dataurl, image: img.src});

                    $scope.$apply();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });