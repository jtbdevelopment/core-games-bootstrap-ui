'use strict';

describe('Service: jtbBootstrapBackdropManager', function () {
    beforeEach(module('ngAnimateMock'));
    beforeEach(module('coreGamesBootstrapUi.services'));

    var service, $rootScope, $animate, $document, body;

    //  necessary because of service runs
    var $uibModal;
    beforeEach(module(function ($provide) {
        $uibModal = {};
        $provide.factory('$uibModal', function () {
            return $uibModal;
        });
    }));

    beforeEach(inject(function (_$q_, $injector, _$rootScope_, _$animate_, _$document_) {
        $rootScope = _$rootScope_;
        $animate = _$animate_;
        $document = _$document_;
        body = $document.find('body').eq(0);
        service = $injector.get('jtbBootstrapBackdropManager');
    }));

    it('calling service functions adds and removes .modal-open to body and creates .modal-backdrop div', function () {
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
        service.addBackdrop();
        $animate.flush();
        expect(body.hasClass('modal-open')).toEqual(true);
        expect($document.find('div').length).toEqual(1);
        service.removeBackdrop();
        $animate.flush();
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
    });

    it('calling add backdrop multiple times does not cause multiple adds', function () {
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
        service.addBackdrop();
        $animate.flush();
        expect(body.hasClass('modal-open')).toEqual(true);
        expect($document.find('div').length).toEqual(1);
        service.addBackdrop();
        var exception = false;
        try {
            $animate.flush();
        } catch (ex) {
            exception = true;
        }
        expect(exception).toEqual(true);
        expect(body.hasClass('modal-open')).toEqual(true);
        expect($document.find('div').length).toEqual(1);

        //cleanup
        service.removeBackdrop();
        service.removeBackdrop();
        $animate.flush();
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
    });

    it('calling remove backdrop multiple times does not cause multiple removes', function () {
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
        service.addBackdrop();
        $animate.flush();
        expect(body.hasClass('modal-open')).toEqual(true);
        expect($document.find('div').length).toEqual(1);
        service.removeBackdrop();
        $animate.flush();
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
        service.removeBackdrop();
        var exception = false;
        try {
            $animate.flush();
        } catch (ex) {
            exception = true;
        }
        expect(exception).toEqual(true);
        expect(body.hasClass('modal-open')).toEqual(false);
        expect($document.find('div').length).toEqual(0);
    });
});

