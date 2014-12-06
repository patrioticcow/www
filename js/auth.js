'use strict';

angular.module('starter.services', [])

    .factory('Auth', function ($q, $ionicPopup, $firebase, $firebaseAuth, FBURL, $location, $rootScope, localStorageService, User) {

        var ref = new Firebase(FBURL);
        var auth = $firebaseAuth(ref);

        var Auth = {
            registerUser: function (u) {
                auth.$createUser(u.email, u.password).then(function () {
                    var user = auth.$authWithPassword({
                        email: u.email,
                        password: u.password
                    });

                    user.then(function (user) {
                        u.uid = user.uid;
                        User.createUser(u);
                    });

                    return user;
                }).then(function (authData) {
                    localStorageService.set('user_auth', JSON.stringify(authData));
                    localStorageService.set('uid', authData.uid);
                    window.location = '/';
                }).catch(function (error) {
                    if (error.code === 'EMAIL_TAKEN') {
                        // TODO add "retrieve password"
                        $ionicPopup.alert({
                            title: 'Warning',
                            template: 'This email is already in use'
                        });
                    }
                    console.error("Error: ", error);
                });

            },
            signedIn: function () {
                return auth.$getAuth();
            },
            login: function (user, redirect) {
                var def = $q.defer();

                if (user.email === undefined) {
                    alert('Email is needed');
                } else if (user.password === undefined) {
                    alert('Password is needed');
                } else {
                    auth.$authWithPassword({
                        email: user.email,
                        password: user.password
                    }).then(function (authData) {
                        localStorageService.set('user_auth', JSON.stringify(authData));
                        localStorageService.set('uid', authData.uid);

                        def.resolve(authData);
                    }).catch(function (error) {
                        if (error.code === 'INVALID_USER') alert('Incorrect Email address');
                        if (error.code === 'INVALID_PASSWORD') alert('Incorrect Password');

                        console.error("Authentication failed:", error);
                    });
                }

                return def.promise;
            },
            logout: function () {
                var def = $q.defer();
                def.resolve(auth.$unauth());

                localStorageService.remove('user_auth');
                localStorageService.remove('uid');
                localStorageService.remove('last_li');

                return def.promise;
            }
        };

        $rootScope.signedIn = function () {
            return Auth.signedIn();
        };

        return Auth;
    });
