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

            var defaultErrorDialog =
                '<div class="general-error-dialog" role="dialog">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title">Sorry!</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<span class="error-message">Something has gone wrong, going to try to re-login and reset.</span>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-default btn-info btn-default-focus close-button" ' +
                'ng-click="errorDialog.closeError()">OK</button>' +
                '</div>' +
                '</div>';
            var params = {
                controller: ['$uibModalInstance', ErrorDialogController],
                controllerAs: 'errorDialog',
                template: defaultErrorDialog
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