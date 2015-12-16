'use strict';

var app = angular.module('homeTaskBoard.taskboard', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/taskboard', {
    templateUrl: '/components/taskboard/taskboard.html',
    controller: 'TaskController'
  });
}]);

app.controller('TaskController', ['$scope', '$uibModal', function($scope, $uibModal) {
    $scope.name = 'World';

    $scope.states = ['Backlog', 'This week target', 'Completed'];
    $scope.tasks = [{
        name: 'Clean Bathroom',
        deadline: 'Next sunday',
        createdBy: '1',
        createdDate: '12 Dec 2015',
        description: 'Clean both bathrooms including commodes too.'
    },
        {
            name: 'Clean Balcony',
            deadline: 'Next sunday',
            createdBy: '1',
            createdDate: '3 Dec 2015',
            state: 1
        },
        {
            name: 'Clean Bathroom',
            deadline: 'Next sunday',
            createdBy: '1',
            createdDate: '12 Dec 2015',
            description: 'Clean both bathrooms including commodes too.',
            state: 1
        },
        {
            name: 'Second state',
            deadline: 'Next sunday',
            createdBy: '1',
            createdDate: '12 Dec 2015',
            description: 'Clean both bathrooms including commodes too.',
            state: 2
        },
        {
            name: 'Shopping done',
            deadline: 'Next sunday',
            createdBy: '1',
            createdDate: '12 Dec 2015',
            description: 'Clean both bathrooms including commodes too.',
            state: 3
        }];

    $scope.open = function (task) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'components/taskboard/createitemtemplate.html',
            controller: 'CreateTaskModelController',
            resolve: {
                task: function () {
                    if(task){
                        return task;
                    } else{
                        return undefined;
                    }
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.tasks.push(selectedItem);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.moveToNextState = function(task){
        task.state = task.state + 1;
    }

    $scope.moveToPreviousState = function(task){
        task.state = task.state - 1;
    }


}]);


app.controller('CreateTaskModelController', function ($scope, $uibModalInstance, task) {

    $scope.task = task || {state: 1};

    $scope.ok = function () {
        $uibModalInstance.close($scope.task);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.directive('myTask', function () {
    return{
        restrict: 'E',
        templateUrl: '/components/taskboard/tasktemplate.html',
    }
});

