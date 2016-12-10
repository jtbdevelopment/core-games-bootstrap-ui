'use strict';

describe('Service: jtbBootstrapGameActions', function () {

    beforeEach(module('coreGamesBootstrapUi.services'));

    var game = {
            id: 'theGameId',
            updated: 0,
            gamePhase: 'SomePhase'
        },
        updatedGame = {
            id: 'theGameId',
            updated: 1,
            gamePhase: 'APhase'
        };

    var playerBaseURL = 'http:/xx.com/y';
    var gameURL = playerBaseURL + '/game/' + game.id + '/';
    var overrideErrorTemplate = 'views/app/myError.html';
    var overrideConfirmTemplate = 'views/app/myConfirm.html';

    var $uibModal, uibModalPromise, $q, $location, gameCache, openParams, $uibModalInstance;
    var backdropManager;
    var adPromise, adHandler = {
        showAdPopup: function() {
            adPromise = $q.defer();
            return adPromise.promise;
        }
    };
    beforeEach(module(function ($provide) {
        backdropManager = {
            addBackdrop: jasmine.createSpy('addBackdrop'),
            removeBackdrop: jasmine.createSpy('removeBackdrop')
        };
        $provide.factory('jtbBootstrapBackdropManager', function() {
            return backdropManager;
        });
        $location = {path: jasmine.createSpy()};
        adPromise = undefined;
        $provide.factory('jtbBootstrapAds', function () {
            return adHandler;
        });
        $provide.factory('$location', function () {
            return $location;
        });
        $uibModalInstance = {
            close: jasmine.createSpy(),
            dismiss: jasmine.createSpy()
        };
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
        updatedGame.gamePhase = 'ResetPhase';
        service = $injector.get('jtbBootstrapGameActions');
    }));


    function testCommonConfirmDialog() {
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('message');
        expect(angular.isFunction(openParams.controller[2])).toEqual(true);
        expect(openParams.resolve.message()).toEqual(confirmMessage);
        var theThis = {};
        openParams.controller[2].call(theThis, $uibModalInstance, confirmMessage);
        expect(theThis.confirmMessage).toEqual(confirmMessage);
        expect($uibModalInstance.close).not.toHaveBeenCalled();
        expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
        theThis.takeAction();
        expect($uibModalInstance.close).toHaveBeenCalled();
        expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
        $uibModalInstance.close.calls.reset();
        theThis.cancelAction();
        expect($uibModalInstance.close).not.toHaveBeenCalled();
        expect($uibModalInstance.dismiss).toHaveBeenCalled();
    }

    function testStandardConfirmDialog() {
        testCommonConfirmDialog();
        expect(openParams.templateUrl).toEqual('views/core-bs/actions/action-confirm-dialog.html');
        expect(openParams.template).toBeUndefined();
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
        expect(openParams.resolve.message()).toEqual(errorMessage);
        var theThis = {};
        openParams.controller[2].call(theThis, $uibModalInstance, errorMessage);
        expect(theThis.errorMessage).toEqual(errorMessage);
        expect($uibModalInstance.close).not.toHaveBeenCalled();
        expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
        theThis.closeError();
        expect($uibModalInstance.close).toHaveBeenCalled();
        expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
    }

    function testStandardErrorDialog() {
        testCommonErrorDialog();
        expect(openParams.templateUrl).toEqual('views/core-bs/actions/action-error-dialog.html');
        expect(openParams.template).toBeUndefined();
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
            locationChange = undefined;
        });

        afterEach(function () {
            $http.flush();
            expect(gameCache.putUpdatedGame).toHaveBeenCalledWith(updatedGame);
            if (angular.isDefined(locationChange)) {
                expect($location.path).toHaveBeenCalledWith(locationChange);
            } else {
                expect($location.path).not.toHaveBeenCalled();
            }
            expect(backdropManager.addBackdrop).toHaveBeenCalled();
            expect(backdropManager.removeBackdrop).toHaveBeenCalled();
        });

        it('test rematch works', function () {
            updatedGame.gamePhase = 'AnotherPhase';
            locationChange = '/game/' + updatedGame.gamePhase.toLowerCase() + '/' + game.id;
            $http.expectPUT(gameURL + 'rematch').respond(updatedGame);
            service.rematch(game);
            expect(adPromise).toBeDefined();
            adPromise.resolve();
        });

        it('test rematch works custom adHandler', function () {
            updatedGame.gamePhase = 'AnotherPhase';
            locationChange = '/game/' + updatedGame.gamePhase.toLowerCase() + '/' + game.id;
            $http.expectPUT(gameURL + 'rematch').respond(updatedGame);
            var p = $q.defer();
            service.rematch(game, function() {
                return p.promise;
            });
            expect(adPromise).toBeUndefined();
            p.resolve();
        });

        it('test new works', function () {
            updatedGame.gamePhase = 'NewPhase';
            locationChange = '/game/' + updatedGame.gamePhase.toLowerCase() + '/' + game.id;
            var options = {
                option1: true,
                flags: [true, false]
            };
            $http.expectPOST(playerBaseURL + '/new', options).respond(updatedGame);
            service.new(options);
            expect(adPromise).toBeDefined();
            adPromise.resolve();
        });

        it('test new works with custom ad', function () {
            updatedGame.gamePhase = 'NewPhase';
            locationChange = '/game/' + updatedGame.gamePhase.toLowerCase() + '/' + game.id;
            var options = {
                option1: true,
                flags: [true, false]
            };
            $http.expectPOST(playerBaseURL + '/new', options).respond(updatedGame);
            var p = $q.defer();
            service.new(options, function() {
                return p.promise;
            });
            expect(adPromise).toBeUndefined();
            p.resolve();
        });

        it('test accept works', function () {
            $http.expectPUT(gameURL + 'accept').respond(updatedGame);
            service.accept(game);
            expect(adPromise).toBeDefined();
            adPromise.resolve();
        });

        it('test accept works with custom ad handler', function () {
            $http.expectPUT(gameURL + 'accept').respond(updatedGame);
            var p = $q.defer();
            service.accept(game, function() {
                return p.promise;
            });
            expect(adPromise).toBeUndefined();
            p.resolve();
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
            expect(backdropManager.addBackdrop).not.toHaveBeenCalled();
            expect(backdropManager.removeBackdrop).not.toHaveBeenCalled();
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
        expect(adPromise).toBeDefined();
        adPromise.resolve();
        $http.flush();
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
        testStandardErrorDialog();
    });

    it('test an error using custom dialog', function () {
        service.setErrorDialogHTMLTemplate(overrideErrorTemplate);
        errorMessage = 'bad thing';
        $http.expectPUT(gameURL + 'accept').respond(401, errorMessage);
        service.accept(game);
        expect(adPromise).toBeDefined();
        adPromise.resolve();
        $http.flush();
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
        testCustomErrorDialog();
    });

    it('test an error using custom handler', function () {
        var handler = jasmine.createSpy();
        service.setErrorHandler(handler);
        expect(service.getErrorHandler()).toEqual(handler);
        errorMessage = 'bad thing';
        $http.expectPUT(gameURL + 'accept').respond(401, errorMessage);
        service.accept(game);
        expect(adPromise).toBeDefined();
        adPromise.resolve();
        $http.flush();
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
        expect(handler).toHaveBeenCalledWith(errorMessage);
    });

    it('test a confirmable action with custom dialog', function () {
        service.setConfirmDialogHTMLTemplate(overrideConfirmTemplate);
        confirmMessage = 'Quit this game!';
        service.quit(game);
        testCustomConfirmDialog();
        uibModalPromise.reject();
        expect(backdropManager.addBackdrop).not.toHaveBeenCalled();
        expect(backdropManager.removeBackdrop).not.toHaveBeenCalled();
    });

    describe('test custom action promises', function () {
        var http, $rootScope;
        beforeEach(inject(function ($http, _$rootScope_) {
            http = $http;
            $rootScope = _$rootScope_;
        }));

        it('function wrap action with success', function () {
            var url = 'something';
            var response = {id: 'id'};
            $http.expectPUT(url).respond(response);
            var success = false;
            service.wrapActionOnGame(http.put(url)).then(function (update) {
                expect(update).toEqual(response);
                success = true;
            });
            $http.flush();
            expect(success).toBeTruthy();
        });

        it('function wrap action with failure', function () {
            var url = 'something';
            $http.expectPUT(url).respond(401);
            var failure = false;
            service.wrapActionOnGame(http.put(url)).then(function () {
            }, function () {
                failure = true;
            });
            $http.flush();
            expect(failure).toBeTruthy();
        });

        it('function wrap confirmable with accept and success', function () {
            var url = 'something';
            var response = {id: 'id'};
            $http.expectPUT(url).respond(response);
            var success = false;
            service.wrapConfirmedActionOnGame('test', function () {
                return http.put(url)
            }).then(function (update) {
                expect(update).toEqual(response);
                success = true;
            });
            uibModalPromise.resolve();
            $http.flush();
            expect(success).toBeTruthy();
        });

        it('function wrap confirmable with accept and http failure', function () {
            var url = 'something';
            $http.expectPUT(url).respond(401);
            var failure = false;
            service.wrapConfirmedActionOnGame('test', function () {
                return http.put(url)
            }).then(
                function () {
                },
                function () {
                    failure = true;
                });
            uibModalPromise.resolve();
            $http.flush();
            expect(failure).toBeTruthy();
        });

        it('function wrap confirmable with reject of confirm to fail', function () {
            var failure = false;
            service.wrapConfirmedActionOnGame('test', function () {
                return http.put(url)
            }).then(
                function () {
                },
                function () {
                    failure = true;
                });
            uibModalPromise.reject();
            $rootScope.$apply();
            expect(failure).toBeTruthy();
        });
    });
});

