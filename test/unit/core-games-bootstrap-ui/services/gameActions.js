'use strict';

describe('Service: jtbBootstrapGameActions', function () {

    // load the controller's module
    beforeEach(module('coreGamesBootstrapUi.services'));

    var game = {id: 'theGameId', updated: 0}, updatedGame = {id: 'theGameId', updated: 1};

    var playerBaseURL = 'http:/xx.com/y';
    var gameURL = playerBaseURL + '/game/' + game.id + '/';
    var overrideErrorTemplate = 'views/app/myError.html';
    var overrideConfirmTemplate = 'views/app/myConfirm.html';

    var $uibModal, uibModalPromise, $q, $location, gameCache, openParams;
    beforeEach(module(function ($provide) {
        $location = {path: jasmine.createSpy()};
        $provide.factory('$location', function () {
            return $location;
        });
        uibModalPromise = undefined;
        openParams = undefined;
        $uibModal = {
            open: function (params) {
                openParams = params;
                uibModalPromise = $q.defer();
                return {result: uibModalPromise.promise};
            }
        };
        $provide.factory('$uibModal', function () {
            return $uibModal;
        });

        gameCache = {
            getGameForID: function (id) {
                if (id === game.id) {
                    return game;
                }
                return undefined;
            },
            putUpdatedGame: jasmine.createSpy()
        };
        $provide.factory('jtbGameCache', function () {
            return gameCache;
        });
        $provide.factory('jtbPlayerService', function () {
            return {
                currentPlayerBaseURL: function () {
                    return playerBaseURL;
                }
            };
        });
    }));

    var service, $http, confirmMessage, errorMessage;

    beforeEach(inject(function ($httpBackend, _$q_, $injector) {
        $http = $httpBackend;
        $q = _$q_;
        confirmMessage = undefined;
        errorMessage = undefined;
        service = $injector.get('jtbBootstrapGameActions');
    }));


    function testCommonConfirmDialog() {
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('message');
        expect(angular.isFunction(openParams.controller[2])).toEqual(true);
        expect(openParams.controller[2].name).toEqual('ConfirmDialogController');
        expect(openParams.resolve.message()).toEqual(confirmMessage);
    }

    function testStandardConfirmDialog() {
        testCommonConfirmDialog();
        expect(openParams.template).toEqual('<div class="game-confirm-dialog"><div class="modal-header"><h4 class="modal-title">{{confirmDialog.confirmMessage}}</h4></div><div class="modal-body"><span class="confirm-message">Are you sure?</span></div><div class="modal-footer"><button class="btn btn-default btn-danger action-button" ng-click="confirmDialog.takeAction()">Yes</button><button class="btn btn-default btn-default btn-default-focus cancel-button" ng-click="confirmDialog.cancelAction()">No</button></div></div>');
        expect(openParams.templateUrl).toBeUndefined();
    }

    function testCustomConfirmDialog() {
        testCommonConfirmDialog();
        expect(openParams.templateUrl).toEqual(overrideConfirmTemplate);
        expect(openParams.template).toBeUndefined();
    }

    function testCommonErrorDialog() {
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('message');
        expect(angular.isFunction(openParams.controller[2])).toEqual(true);
        expect(openParams.controller[2].name).toEqual('ErrorDialogController');
        expect(openParams.resolve.message()).toEqual(errorMessage);
    }

    function testStandardErrorDialog() {
        testCommonErrorDialog();
        expect(openParams.template).toEqual('<div class="game-error-dialog" role="dialog"><div class="modal-header"><h4 class="modal-title">Sorry!</h4></div><div class="modal-body"><span class="error-message">{{errorDialog.errorMessage}}</span></div><div class="modal-footer"><button class="btn btn-default btn-info btn-default-focus close-button" ng-click="errorDialog.closeError()">OK</button></div></div>');
        expect(openParams.templateUrl).toBeUndefined();
    }

    function testCustomErrorDialog() {
        testCommonErrorDialog();
        expect(openParams.templateUrl).toEqual(overrideErrorTemplate);
        expect(openParams.template).toBeUndefined();
    }

    it('test get game url', function () {
        expect(service.getGameURL(game)).toEqual(gameURL);
    });

    describe('standard functions and dialogs without errors', function () {
        var locationChange;
        beforeEach(function () {
            locationChange = false;
        });

        afterEach(function () {
            $http.flush();
            expect(gameCache.putUpdatedGame).toHaveBeenCalledWith(updatedGame);
            if (locationChange) {
                expect($location.path).toHaveBeenCalledWith('/main');
            } else {
                expect($location.path).not.toHaveBeenCalled();
            }
        });

        it('test rematch works', function () {
            locationChange = true;
            $http.expectPUT(gameURL + 'rematch').respond(updatedGame);
            service.rematch(game);
        });

        it('test accept works', function () {
            $http.expectPUT(gameURL + 'accept').respond(updatedGame);
            service.accept(game);
        });

        describe('with positive confirm using standard confirm dialog', function () {
            afterEach(function () {
                uibModalPromise.resolve();
            });

            it('test quit works', function () {
                confirmMessage = 'Quit this game!';
                service.quit(game);
                testStandardConfirmDialog();
                $http.expectPUT(gameURL + 'quit').respond(updatedGame);
            });

            it('test reject works', function () {
                confirmMessage = 'Reject this game!';
                service.reject(game);
                testStandardConfirmDialog();
                $http.expectPUT(gameURL + 'reject').respond(updatedGame);
            });

            it('test decline rematch works', function () {
                confirmMessage = 'Decline further rematches.';
                service.declineRematch(game);
                testStandardConfirmDialog();
                $http.expectPUT(gameURL + 'endRematch').respond(updatedGame);
            });
        });
    });

    describe('standard confirmable actions with negative confirm using standard confirm dialog', function () {
        afterEach(function () {
            uibModalPromise.reject();
        });

        it('test quit not sent on', function () {
            confirmMessage = 'Quit this game!';
            service.quit(game);
            testStandardConfirmDialog();
        });

        it('test reject not sent on', function () {
            confirmMessage = 'Reject this game!';
            service.reject(game);
            testStandardConfirmDialog();
        });

        it('test decline rematch not sent on', function () {
            confirmMessage = 'Decline further rematches.';
            service.declineRematch(game);
            testStandardConfirmDialog();
        });
    });

    it('test an error using standard dialog', function () {
        errorMessage = 'bad thing';
        $http.expectPUT(gameURL + 'accept').respond(401, errorMessage);
        service.accept(game);
        $http.flush();
        testStandardErrorDialog();
    });

    it('test an error using custom dialog', function () {
        service.setErrorDialogHTMLTemplate(overrideErrorTemplate);
        errorMessage = 'bad thing';
        $http.expectPUT(gameURL + 'accept').respond(401, errorMessage);
        service.accept(game);
        $http.flush();
        testCustomErrorDialog();
    });

    it('test an error using custom handler', function () {
        var handler = jasmine.createSpy();
        service.setErrorHandler(handler);
        errorMessage = 'bad thing';
        $http.expectPUT(gameURL + 'accept').respond(401, errorMessage);
        service.accept(game);
        $http.flush();
        expect(handler).toHaveBeenCalledWith(errorMessage);
    });

    it('test a confirmable action with custom dialog', function () {
        service.setConfirmDialogHTMLTemplate(overrideConfirmTemplate);
        confirmMessage = 'Quit this game!';
        service.quit(game);
        testCustomConfirmDialog();
        uibModalPromise.reject();
    });

});

