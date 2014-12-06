'use strict';

angular.module('starter.controllers')

    .controller('RegisterCtrl', function ($scope, $location, Auth, User) {
        // Perform the registration action when the user submits the register form
        $scope.doRegister = function (isValid) {
            if (isValid) Auth.registerUser($scope.user);
        };
    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3}
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    });
