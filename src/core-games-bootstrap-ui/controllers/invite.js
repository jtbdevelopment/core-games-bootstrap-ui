'use strict';

angular.module('coreGamesBootstrapUi.controllers').controller('CoreBootstrapInviteCtrl',
    ['$uibModalInstance', 'invitableFriends', 'message', 'jtbFacebook',
        function ($uibModalInstance, invitableFriends, message, jtbFacebook) {
            var controller = this;
            controller.invitableFriends = invitableFriends;
            controller.chosenFriends = [];
            controller.message = message;
            controller.invite = function () {
                var ids = [];
                angular.forEach(controller.chosenFriends, function (chosen) {
                    ids.push(chosen.id);
                });
                jtbFacebook.inviteFriends(ids, message);
                $uibModalInstance.close();
            };
            controller.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);

