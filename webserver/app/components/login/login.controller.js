'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'components/login/login.html',
            controller: 'LoginController'
        });
    }])
    .controller('LoginController', ['$scope', '$auth', 'userContext', '$rootScope',
        function($scope, $auth, userContext, $rootScope) {

            if($auth.isAuthenticated()){
                $scope.authenticated = true;

            } else{
                $scope.authenticated = false;
            }
            $scope.authenticate = function(provider){

                $auth.authenticate(provider).then(function(response){

                    $scope.authenticated = true;
                    $scope.user = response.data.user;
                    userContext.user = response.data.user;
                    userContext.isAuthenticated = true;
                    $rootScope.user = response.data.user;
                });

            };

            $scope.logOut = function () {
                $scope.authenticated = false;
                $rootScope.user = null;
                userContext.user = null;
                userContext.isAuthenticated = false;
                $auth.logout();
            };

            $rootScope.$watch('user', function(){
                $scope.user = $rootScope.user;
            }, true);

            $scope.getUserName = userContext.getUserName;
        }]);