'use strict';

angular.module('coreGamesBootstrapUi.services').run(
    ['$rootScope', '$location', '$uibModal',
        function ($rootScope, $location, $uibModal) {
            function ErrorDialogController($uibModalInstance) {
                var controller = this;
                controller.closeError = function () {
                    $uibModalInstance.close();
                    $location.path('/signin');
                };
            }

            var params = {
                controller: ['$uibModalInstance', ErrorDialogController],
                controllerAs: 'errorDialog',
                templateUrl: 'views/core-bs/errors/error-dialog.html'
            };

            function showErrorAndReconnect() {
                $uibModal.open(params);
            }

            $rootScope.$on('InvalidSession', function () {
                showErrorAndReconnect();
            });
            $rootScope.$on('GeneralError', function () {
                showErrorAndReconnect();
            });
        }
    ]
);