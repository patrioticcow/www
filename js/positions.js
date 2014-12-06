'use strict';

angular.module('starter.services')

    .factory('Positions', function ($q, $firebase, FBURL) {
        console.log('PositionsFactory');
        var ref = new Firebase(FBURL + 'positions');
        var positions = $firebase(ref);

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

        var fetchById = function (id) {
            var def = $q.defer();

            ref.child(id).on('value', function (snapshot) {
                def.resolve(snapshot.val());
            }, function (errorObject) {
                console.log('The read failed: ' + errorObject.code);
            });

            return def.promise;
        };

        var update = function (id, obj) {
            ref.child(id).update(obj);
        };

        var Positions = {
            create: function (authUser, user) {

            },
            fetchAll: function (limit, start, end) {
                return fetchAll(limit, start, end);
            },
            fetchById: function (id) {
                return fetchById(id);
            },
            update: function (id, obj) {
                return update(id, obj);
            }
        };

        return Positions;
    });
