'use strict';

angular.module('starter.controllers')

    .controller('AppCtrl', function ($scope, $ionicModal, $firebaseAuth, $timeout, $ionicLoading, $location, Auth) {
        console.log('AppCtrl');

        $scope.isLoggedin = false;
        $scope.uid = localStorage['position.uid'];

        if (Auth.signedIn()) $scope.isLoggedin = true;

        // Form data for the login modal
        $scope.user = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            Auth.login($scope.user).then(function (user) {
                $scope.uid = user.uid;
                $scope.modal.hide();
                $scope.isLoggedin = true;
            }, function (error) {
                $scope.error = error.toString();
            });
        };
    });