'use strict';

describe('Controller: CoreBootstrapInviteCtrl', function () {

    // load the controller's module
    beforeEach(module('coreGamesBootstrapUi.controllers'));

    var InviteCtrl, scope;

    var invitableFriends = [{name: 'X', id: '1'}, {name: 'Y', id: '5'}, {name: 'Z', id: '10'}];
    var facebookMock = {inviteFriends: jasmine.createSpy()};
    var modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
    var aMessage = 'Come play frosty cones!';

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        invitableFriends = [];
        scope = $rootScope.$new();
        InviteCtrl = $controller('CoreBootstrapInviteCtrl', {
            $scope: scope,
            jtbFacebook: facebookMock,
            $uibModalInstance: modalInstance,
            message: aMessage,
            invitableFriends: function () {
                return invitableFriends;
            }
        });
    }));

    it('initializes to friends and none chosen', function () {
        expect(InviteCtrl.invitableFriends()).toEqual(invitableFriends);
        expect(InviteCtrl.chosenFriends).toEqual([]);
    });

    it('cancel closes dialog', function () {
        InviteCtrl.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(facebookMock.inviteFriends).not.toHaveBeenCalled();
    });

    it('invite invites chosen friend ids', function () {
        InviteCtrl.chosenFriends = [{name: 'X', id: '1'}, {name: 'A', id: '3'}];
        InviteCtrl.invite();
        expect(modalInstance.close).toHaveBeenCalled();
        expect(facebookMock.inviteFriends).toHaveBeenCalledWith(['1', '3'], aMessage);
    });
});
