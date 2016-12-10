'use strict';

describe('Service: errorHandler registered', function () {
    beforeEach(module('coreGamesBootstrapUi.services'));

    var $uibModal, uibModalPromise, $q, $location, openParams, $uibModalInstance, $rootScope;
    beforeEach(module(function ($provide) {
        $location = {path: jasmine.createSpy()};
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
    }));

    beforeEach(inject(function (_$q_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    function testCommonErrorDialog() {
        expect(openParams.controller[0]).toEqual('$uibModalInstance');
        expect(angular.isFunction(openParams.controller[1])).toEqual(true);
        var theThis = {};
        openParams.controller[1].call(theThis, $uibModalInstance);
        expect($uibModalInstance.close).not.toHaveBeenCalled();
        expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
        theThis.closeError();
        expect($uibModalInstance.close).toHaveBeenCalled();
        expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/signin');
    }

    function testStandardErrorDialog() {
        testCommonErrorDialog();
        expect(openParams.templateUrl).toEqual('views/core-bs/errors/error-dialog.html');
        expect(openParams.template).toBeUndefined();
    }

    it('test an invalid session error broadcast is handled', function () {
        $rootScope.$broadcast('InvalidSession');
        $rootScope.$apply();
        testStandardErrorDialog();
    });

    it('test an general error broadcast is handled', function () {
        $rootScope.$broadcast('GeneralError');
        $rootScope.$apply();
        testStandardErrorDialog();
    });

});

