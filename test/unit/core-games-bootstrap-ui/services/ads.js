'use strict';

describe('Service: jtbBootstrapAds', function () {
    beforeEach(module('coreGamesBootstrapUi.services'));

    var appCB;
    var service, $q, $rootScope, adCalls;

    //  necessary because of service runs
    var $uibModal;
    var backdropManager;
    beforeEach(module(function ($provide) {
        $uibModal = {
        };
        $provide.factory('$uibModal', function () {
            return $uibModal;
        });
        backdropManager = {
            addBackdrop: jasmine.createSpy('addBackdrop'),
            removeBackdrop: jasmine.createSpy('removeBackdrop')
        };
        $provide.factory('jtbBootstrapBackdropManager', function() {
            return backdropManager;
        });
    }));

    beforeEach(inject(function (_$q_, $injector, _$rootScope_) {
        window.invokeApplixirVideoUnitExtended = function (b, p, cb) {
            expect(b).toEqual(false);
            expect(p).toEqual('middle');
            appCB = cb;
            adCalls += 1;
        };
        adCalls = 0;
        $q = _$q_;
        $rootScope = _$rootScope_;
        appCB = undefined;
        service = $injector.get('jtbBootstrapAds');
    }));

    it('opens add and resolves promise normally', function () {
        var promiseResolved = false;
        service.showAdPopup().then(function () {
            promiseResolved = true;
        });
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        appCB();
        $rootScope.$apply();
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
        expect(promiseResolved).toEqual(true);
    });

    it('showing ad shortly after first time does nothing and resolves promise promise normally', function () {
        var promiseResolved = false;
        service.showAdPopup().then(function () {
            promiseResolved = true;
        });
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        appCB();
        $rootScope.$apply();
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
        expect(promiseResolved).toEqual(true);

        backdropManager.removeBackdrop.calls.reset();
        backdropManager.addBackdrop.calls.reset();
        promiseResolved = false;
        service.showAdPopup().then(function () {
            promiseResolved = true;
        });
        $rootScope.$apply();
        expect(backdropManager.addBackdrop).not.toHaveBeenCalled();
        expect(backdropManager.removeBackdrop).not.toHaveBeenCalled();
        expect(promiseResolved).toEqual(true);
        expect(adCalls).toEqual(1);
    });

    it('showing ad shortly after first time shows ad again if time overridden to 0', function () {
        var promiseResolved = false;
        service.setFrequency(0);
        service.showAdPopup().then(function () {
            promiseResolved = true;
        });
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        appCB();
        $rootScope.$apply();
        expect(promiseResolved).toEqual(true);
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();

        backdropManager.removeBackdrop.calls.reset();
        backdropManager.addBackdrop.calls.reset();
        promiseResolved = false;
        service.showAdPopup().then(function () {
            promiseResolved = true;
        });
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        appCB();
        $rootScope.$apply();
        expect(promiseResolved).toEqual(true);
        expect(adCalls).toEqual(2);
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
    });

    it('passes on ad if exception throw', function () {
        window.invokeApplixirVideoUnitExtended = function (b, p) {
            expect(b).toEqual(false);
            expect(p).toEqual('middle');
            throw 'Error!';
        };
        var promiseResolved = false;
        service.showAdPopup().then(function () {
            promiseResolved = true;
        });
        expect(backdropManager.addBackdrop).toHaveBeenCalled();
        $rootScope.$apply();
        expect(promiseResolved).toEqual(true);
        expect(backdropManager.removeBackdrop).toHaveBeenCalled();
    });
});
