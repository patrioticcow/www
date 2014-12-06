'use strict';

angular.module('starter.services')

    .factory('Comments', function ($q, $firebase, FBURL, User, $rootScope, localStorageService) {
        console.log('CommentsFactory');
        var ref = new Firebase(FBURL + 'comments');
        var comments = $firebase(ref);

        var fetchAll = function () {
            var def = $q.defer();
            ref.on('value', function (snapshot) {
                def.resolve(snapshot.val());
            }, function (errorObject) {
                console.log('The read failed: ' + errorObject.code);
            });

            return def.promise;
        };

        var fetchById = function (params, limit, start, end) {
            limit = limit || null;
            start = start || null;
            end = end || null;

            var def = $q.defer();

            if (limit) {
                ref.child(params.commentId).limitToLast(limit).on('value', function (snapshot) {
                    def.resolve(snapshot.val());
                }, function (errorObject) {
                    console.log('The read failed: ' + errorObject.code);
                });
            } else if (start) {
                ref.child(params.commentId).orderByKey().startAt(start).endAt(end).on('value', function (snapshot) {
                    def.resolve(snapshot.val());
                }, function (errorObject) {
                    console.log('The read failed: ' + errorObject.code);
                });
            } else {
                ref.child(params.commentId).on('value', function (snapshot) {
                    def.resolve(snapshot.val());
                }, function (errorObject) {
                    console.log('The read failed: ' + errorObject.code);
                });
            }

            return def.promise;
        };

        var fetchByIdWithUser = function (params, limit, start, end) {
            var def = $q.defer();
            fetchById(params, limit, start, end).then(function (comments) {
                for (var key in comments) {
                    (function (index) {
                        User.findById(comments[index].sender).then(function (user) {
                            comments[index].user = {name: user.name, smallImage: user.smallImage};
                        });
                    })(key);
                }
                def.resolve(comments);
            });
            return def.promise;
        };

        var Comments = {
            create: function (authUser, user) {

            },
            fetchAll: function () {
                return fetchAll();
            },
            fetchById: function (params) {
                return fetchById(params);
            },
            fetchByIdWithUser: function (params, limit, start, end) {
                return fetchByIdWithUser(params, limit, start, end);
            }
        };

        return Comments;
    });
