'use strict';

angular.module('starter.controllers')

    .controller('CommentsCtrl', function (FBURL, $q, $scope, $stateParams, $firebase, $location, $ionicLoading, $ionicScrollDelegate, localStorageService, Auth, Comments, Positions, User) {
        console.log('CommentsCtrl');

        $ionicLoading.show({template: 'Loading...'});

        $scope.user = JSON.parse(localStorage['position.user_auth']);
        $scope.userDetails = {};
        $scope.comments = {};
        $scope.comment = {};
        $scope.resolved = false;
        $scope.showForm = false;

        var commentsRef = new Firebase(FBURL + 'comments');
        var newItems = false;
        var limit = 8;

        $q.all([
            User.findById($scope.user.uid).then(function (user) {
                return user;
            }),
            Comments.fetchByIdWithUser($stateParams, limit).then(function (user) {
                return user;
            })
        ]).then(function (values) {
            console.log(values);
            $scope.userDetails = values[0];
            $scope.resolved = true;
            $scope.showForm = true;

            // get initial comments
            if (values[1]) {
                $scope.comments = values[1];
                $scope.size = parseInt(Object.keys(values[1])[0]) + (limit + 1);

                $ionicScrollDelegate.scrollBottom(true);

                // first key from the loaded comments
                localStorageService.set('first_li', $scope.size - getSize(values[1]) - 1);
                localStorageService.set('last_li', $scope.size);
            }

            $ionicLoading.hide();
        });

        // get newly added comments
        commentsRef.child($stateParams.commentId).endAt().limitToLast(1).on('child_added', function (snapshot) {
            var obj = snapshot.val();
            console.log('child_added --- ', obj);

            if ($scope.userDetails.uid !== obj.sender) {
                User.findById(obj.sender).then(function (user) {
                    obj['user'] = user;

                    $scope.comments[$scope.size] = obj;
                    $scope.size = $scope.size + 1;

                    $scope.safeApply();

                    $ionicScrollDelegate.scrollBottom(true);
                });
            } else {
                obj['user'] = $scope.userDetails;

                $scope.comments[$scope.size] = obj;
                $scope.size = $scope.size + 1;

                $scope.safeApply();

                $ionicScrollDelegate.scrollBottom(true);
            }
        });

        // load more comments
        $scope.loadMoreComments = function () {
            var firstLi = localStorageService.get('first_li');
            var first = firstLi - limit;

            Comments.fetchByIdWithUser($stateParams, null, first.toString(), firstLi.toString()).then(function (comments) {
                localStorageService.set('first_li', first);

                $scope.comments = merge_options(comments, $scope.comments);

                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        // add comment
        $scope.leaveComment = function () {
            if ($scope.comment.message === null || $scope.comment.message === undefined || $scope.comment.message === '') {
                alert('Message is needed');
            } else {
                newItems = true;
                var obj = {};
                var key = $scope.size === undefined ? parseInt($stateParams.commentId) : $scope.size;
                obj[key] = {message: $scope.comment.message, sender: $scope.user.uid};

                // add comment
                commentsRef.child($stateParams.commentId).update(obj);

                // update position count
                Positions.fetchById($stateParams.commentId).then(function (positions) {
                    Positions.update($stateParams.commentId, {comments: positions.comments + 1});
                });

                $scope.size = key + 1;
                $scope.comment.message = null;
            }
        };

        // HELEPRS
        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
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