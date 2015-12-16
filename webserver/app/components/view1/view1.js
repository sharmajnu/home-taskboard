'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: '/components/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', '$auth', function($scope, $http, $auth) {

      $scope.message = "hello angular";
      $scope.products = {};

      $http({
        method: 'GET',
        url: '/api/products'
      }).then(function successCallback(response) {

        $scope.products =  response.data;
      }, function errorCallback(response) {

      });
        
        $scope.authenticate = function (provider) {
            $auth.authenticate(provider);
        }

}]);

