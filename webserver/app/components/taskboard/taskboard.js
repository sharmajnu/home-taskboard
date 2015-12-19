'use strict';

var app = angular.module('homeTaskBoard.taskboard', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/taskboard', {
        templateUrl: '/components/taskboard/taskboard.html',
        controller: 'TaskController'
    });
}]);

app.controller('TaskController', ['$scope', '$uibModal', 'userContext', '$location', '$auth', '$http',
    function ($scope, $uibModal, userContext, $location, $auth, $http) {

        $scope.name = 'World';

        $scope.states = ['Backlog', 'This week target', 'Completed'];

        function loadTasksFromServer() {
            $http.get('/api/tasks').then(function (response) {
                $scope.tasks = response.data;

            }, function (error) {
                $scope.error = error;
            });
        }

        loadTasksFromServer();

        $scope.open = function (task) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/taskboard/createitemtemplate.html',
                controller: 'CreateTaskModelController',
                resolve: {
                    task: function () {
                        if (task) {
                            return task;
                        } else {
                            return undefined;
                        }
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                loadTasksFromServer();
            }, function () {

            });
        };

        $scope.viewTaskDetails = function (task) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/taskboard/taskdetailsview.html',
                controller: 'ViewTaskModelController',
                resolve: {
                    task: function () {
                        if (task) {
                            return task;
                        } else {
                            return undefined;
                        }
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {

            });
        };

        function updateStateAtServer(task) {
            $http.post('/api/tasks/updatestate/' + task._id, JSON.stringify({state:task.state})).then(function () {
                console.log('Task updated successfully');
            }, function (error) {
                console.error('something went wrong in updating the state at server', error);
                loadTasksFromServer();
            });
        }

        $scope.moveToNextState = function (task) {
            task.state = task.state + 1;
            updateStateAtServer(task);

        };

        $scope.moveToPreviousState = function (task) {
            task.state = task.state - 1;
            updateStateAtServer(task);
        };
    }]);


app.controller('CreateTaskModelController', ['$scope', '$uibModalInstance', '$http', 'task',
    function ($scope, $uibModalInstance, $http, task) {


        $scope.task = task || {state: 1, priority: 3};

        $scope.ok = function () {

            if ($scope.task._id) {
                $http.put('/api/tasks/' + $scope.task._id, JSON.stringify($scope.task)).then(function () {
                    console.log('Task updated successfully');
                }, function (error) {
                    console.log(error);
                });

            } else {

                console.log($scope.task);

                $http.post('/api/tasks', JSON.stringify($scope.task)).then(function (res) {
                    var id = res.data;
                    console.log(id, ": Task created successfully...");

                }, function (error) {
                    console.log(error);
                });
            }

            $uibModalInstance.close($scope.task);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

app.controller('ViewTaskModelController', ['$scope', '$uibModalInstance', '$http', 'task',
    function ($scope, $uibModalInstance, $http, task) {

        $scope.task = task;

        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

app.directive('myTask', function () {
    return {
        restrict: 'E',
        templateUrl: '/components/taskboard/tasktemplate.html',
    }
});

