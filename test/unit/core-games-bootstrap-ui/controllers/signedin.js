'use strict';

describe('Controller: CoreBootstrapSignedInCtrl', function () {

    // load the controller's module
    beforeEach(module('coreGamesBootstrapUi.controllers'));

    var SignedInCtrl;

    var location = {path: jasmine.createSpy()};
    var httpCache = {removeAll: jasmine.createSpy()};
    var cacheFactory = {
        get: function (name) {
            if (name === '$http') {
                return httpCache;
            }
        }
    };
    var scope;
    var rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        spyOn(rootScope, '$broadcast').and.callThrough();
        SignedInCtrl = $controller('CoreBootstrapSignedInCtrl', {
            $scope: scope,
            $location: location,
            $rootScope: rootScope,
            $cacheFactory: cacheFactory
        });
    }));

    it('on entering, clears cache, broadcasts login and goes to signedin', function () {
        expect(httpCache.removeAll).toHaveBeenCalled();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('login');
        expect(location.path).toHaveBeenCalledWith('/main')
    });
});