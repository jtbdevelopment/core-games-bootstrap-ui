(function (angular) {

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp

    // Config
    angular.module('coreGamesBootstrapUi.config', [])
        .value('coreGamesBootstrapUi.config', {
            debug: true
        });

    // Modules
    angular.module('coreGamesBootstrapUi.controllers', []);
    angular.module('coreGamesBootstrapUi.directives', []);
    angular.module('coreGamesBootstrapUi.filters', []);
    angular.module('coreGamesBootstrapUi.services', []);
    angular.module('coreGamesBootstrapUi',
        [
            'coreGamesBootstrapUi.config',
            'coreGamesBootstrapUi.directives',
            'coreGamesBootstrapUi.filters',
            'coreGamesBootstrapUi.services',
            'coreGamesBootstrapUi.controllers',
            'ngResource',
            'ngCookies',
            'ngSanitize',
            'ui.bootstrap'
        ]);

})(angular);

'use strict';

//  TODO - this is dependent on angular-bootstrap - this should get removed from this library
angular.module('coreGamesBootstrapUi.controllers').controller('CoreBootstrapInviteCtrl',
    ['$uibModalInstance', '$scope', 'invitableFriends', 'message', 'jtbFacebook',
        function ($uibModalInstance, $scope, invitableFriends, message, jtbFacebook) {
            $scope.invitableFriends = invitableFriends;
            $scope.chosenFriends = [];
            $scope.message = message;
            $scope.invite = function () {
                var ids = [];
                angular.forEach($scope.chosenFriends, function (chosen) {
                    ids.push(chosen.id);
                });
                jtbFacebook.inviteFriends(ids, message);
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);

