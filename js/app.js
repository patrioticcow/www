// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'LocalStorageModule', 'starter.controllers', 'starter.services', 'starter.directive', 'ionic.contrib.ui.cards'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .constant('FBURL', 'https://excite.firebaseio.com/')

    .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('position');
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.register', {
                url: "/register",
                views: {
                    'menuContent': {
                        templateUrl: "templates/register.html",
                        controller: 'RegisterCtrl'
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: 'LogoutCtrl'
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html",
                        controller: 'BrowseCtrl'
                    }
                }
            })

            .state('app.users', {
                url: "/users",
                views: {
                    'menuContent': {
                        templateUrl: "templates/users.html",
                        controller: 'UsersCtrl'
                    }
                }
            })

            .state('app.profile', {
                url: "/profile/:userId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('app.comments', {
                url: "/comments/:commentId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/comments.html",
                        controller: 'CommentsCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

angular.module('starter.controllers', []);