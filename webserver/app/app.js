'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'satellizer',
  'myApp.view1',
  'myApp.login',
  'myApp.details'

]).
controller('HeaderController', ['$scope', '$rootScope', 'userContext', function ($scope, $rootScope, userContext) {
    $rootScope.$watch('user', function(){
        $scope.user = $rootScope.user;
    }, true);
}])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
      $authProvider.google({
        clientId: '978616852397-tbcptkaj8q0gjtoak4ap58rndnrd0g37.apps.googleusercontent.com',
        url: '/auth/google'
      });
}]);
