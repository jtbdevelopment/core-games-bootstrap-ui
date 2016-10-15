'use strict';

describe('Service: jtbBootstrapGameActions', function () {

    beforeEach(module('coreGamesBootstrapUi.services'));

    var versionAsInt = 9.3;
    var player = {
        lastVersionNotes: '' + versionAsInt + ''
    };
    var $uibModal, uibModalPromise, $q, openParams, $uibModalInstance, playerService;
    beforeEach(module(function ($provide) {
        $uibModalInstance = {
            close: jasmine.createSpy()
        };
        uibModalPromise = undefined;
        openParams = undefined;
        playerService = {
            currentPlayer: function () {
                return player
            },
            updateLastVersionNotes: jasmine.createSpy('updateLastVersionNotes')
        };
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

        $provide.factory('jtbPlayerService', function () {
            return playerService;
        });
    }));

    var service, $http;

    beforeEach(inject(function ($httpBackend, _$q_, $injector) {
        $http = $httpBackend;
        $q = _$q_;
        service = $injector.get('jtbBootstrapVersionNotesService');
    }));

    it('does nothing if version is = current version as float', function () {
        service.displayVersionNotesIfAppropriate(versionAsInt);
        expect(uibModalPromise).toBeUndefined();
        expect(openParams).toBeUndefined();
    });

    it('does nothing if version is = current version as string', function () {
        service.displayVersionNotesIfAppropriate('' + versionAsInt);
        expect(uibModalPromise).toBeUndefined();
        expect(openParams).toBeUndefined();
        expect(playerService.updateLastVersionNotes).not.toHaveBeenCalled();
    });

    it('pops up and updates notes on server if minor patch, no template', function () {
        var updatedNotes = 'Blah blah';
        service.displayVersionNotesIfAppropriate(versionAsInt + 0.1, updatedNotes);
        expect(uibModalPromise).toBeDefined();
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('currentVersion');
        expect(openParams.controller[2]).toEqual('releaseNotes');
        expect(angular.isFunction(openParams.controller[3])).toEqual(true);
        expect(openParams.controllerAs).toEqual('versionDialog');
        expect(openParams.templateUrl).toEqual('views/core-bs/version-notes/version-notes.html');
        expect(openParams.resolve.currentVersion()).toEqual(9.4);
        expect(openParams.resolve.releaseNotes()).toEqual(updatedNotes);
        expect(playerService.updateLastVersionNotes).toHaveBeenCalledWith(9.4);
    });

    it('pops up and updates notes on server if major patch, no template', function () {
        var updatedNotes = 'Blah blah bleh!';
        service.displayVersionNotesIfAppropriate(versionAsInt + 1, updatedNotes);
        expect(uibModalPromise).toBeDefined();
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('currentVersion');
        expect(openParams.controller[2]).toEqual('releaseNotes');
        expect(angular.isFunction(openParams.controller[3])).toEqual(true);
        expect(openParams.controllerAs).toEqual('versionDialog');
        expect(openParams.templateUrl).toEqual('views/core-bs/version-notes/version-notes.html');
        expect(openParams.resolve.currentVersion()).toEqual(10.3);
        expect(openParams.resolve.releaseNotes()).toEqual(updatedNotes);
        expect(playerService.updateLastVersionNotes).toHaveBeenCalledWith(10.3);
    });

    it('pops up and updates notes on server if major patch, with template', function () {
        var updatedNotes = 'Blah blah bleh!';
        var template = 'views/mineOwn.html';
        service.displayVersionNotesIfAppropriate(versionAsInt + 1, updatedNotes, template);
        expect(uibModalPromise).toBeDefined();
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('currentVersion');
        expect(openParams.controller[2]).toEqual('releaseNotes');
        expect(angular.isFunction(openParams.controller[3])).toEqual(true);
        expect(openParams.controllerAs).toEqual('versionDialog');
        expect(openParams.templateUrl).toEqual(template);
        expect(openParams.resolve.currentVersion()).toEqual(10.3);
        expect(openParams.resolve.releaseNotes()).toEqual(updatedNotes);
        expect(playerService.updateLastVersionNotes).toHaveBeenCalledWith(10.3);
    });

    it('pops up and updates notes on server if major patch, with template', function () {
        var updatedNotes = 'Blah blah bleh!';
        var template = 'views/mineOwn.html';
        service.displayVersionNotesIfAppropriate(versionAsInt + 1, updatedNotes, template);
        expect(uibModalPromise).toBeDefined();
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(openParams.controller[1]).toEqual('currentVersion');
        expect(openParams.controller[2]).toEqual('releaseNotes');
        expect(angular.isFunction(openParams.controller[3])).toEqual(true);
        expect(openParams.controllerAs).toEqual('versionDialog');
        expect(openParams.templateUrl).toEqual(template);
        expect(openParams.resolve.currentVersion()).toEqual(10.3);
        expect(openParams.resolve.releaseNotes()).toEqual(updatedNotes);
        expect(playerService.updateLastVersionNotes).toHaveBeenCalledWith(10.3);
    });

    it('modal initializer and closing', function() {
        var updatedNotes = 'Blah blah bleh!';
        var newVersion = versionAsInt + 1;
        service.displayVersionNotesIfAppropriate(newVersion, updatedNotes);
        var theThis = {};
        openParams.controller[3].call(theThis, $uibModalInstance, newVersion, updatedNotes);
        expect(theThis.currentVersion).toEqual(newVersion);
        expect(theThis.releaseNotes).toEqual(updatedNotes);
        theThis.close();
        expect($uibModalInstance.close).toHaveBeenCalled();
    });
});