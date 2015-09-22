var app = angular.module('app', []);

app.factory('Socket', function($rootScope) {
    var socket = io.connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller('main', ['$scope', 'Socket',
    function($scope, Socket) {
        $scope.start = true;
        $scope.streamSrc = '';
        $scope.startStream = function() {
            Socket.emit('start-stream');
        }
        Socket.on('live-stream', function(url) {
            $scope.streamSrc = url;
            $scope.start = false;
        });
    }
]);