'use strict';

angular.module('starter.services')

    .factory('User', function ($q, $firebase, FBURL, $rootScope, localStorageService) {
        console.log('UserFactory');
        var ref = new Firebase(FBURL + 'users');
        var users = $firebase(ref);

        var getRef = function () {
            return ref;
        };

        var currentUser = function () {
            var def = $q.defer();
            def.resolve(localStorageService.get('user_auth'));
            return def.promise;
        };

        var createUser = function (user) {
            var obj = {};
            obj[user.uid] = user;

            console.warn('adding', obj);
            ref.update(obj);
        };

        var findById = function (id) {
            var def = $q.defer();

            ref.child(id).on("value", function (user) {
                def.resolve(user.val());
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

            return def.promise;
        };

        var fetchAll = function (limit, start, end) {
            limit = limit || null;
            start = start || null;
            end = end || null;

            var def = $q.defer();

            if (limit) {
                ref.limitToLast(limit).on('value', function (snapshot) {
                    def.resolve(snapshot.val());
                }, function (errorObject) {
                    console.log('The read failed: ' + errorObject.code);
                });
            } else if (start) {
                ref.orderByKey().startAt(start).endAt(end).on('value', function (snapshot) {
                    def.resolve(snapshot.val());
                }, function (errorObject) {
                    console.log('The read failed: ' + errorObject.code);
                });
            } else {
                ref.on('value', function (snapshot) {
                    def.resolve(snapshot.val());
                }, function (errorObject) {
                    console.log('The read failed: ' + errorObject.code);
                });
            }

            return def.promise;
        };

        return {
            findById: function (id) {
                return findById(id);
            },
            createUser: function (user) {
                return createUser(user);
            },
            currentUser: function () {
                return currentUser();
            },
            fetchAll: function (limit, start, end) {
                return fetchAll(limit, start, end);
            },
            ref: function () {
                return getRef();
            }
        };
    });
