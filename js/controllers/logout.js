'use strict';

angular.module('starter.controllers')

    .controller('LogoutCtrl', function ($scope, $stateParams, $location, Auth) {
        Auth.logout().then(function () {
            $scope.isLoggedin = false;
            //$location.path('/');
            window.location = '/';
        });
    });
