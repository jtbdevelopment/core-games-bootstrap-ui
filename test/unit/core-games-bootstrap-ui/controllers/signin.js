'use strict';

describe('Controller: CoreBootstrapSignInCtrl', function () {

    // load the controller's module
    beforeEach(module('coreGamesBootstrapUi.controllers'));

    var SignInCtrl, scope, q, mockFacebook, autoLogin, doLogin;
    var cookies = {
        somethin: 'somethin'
    };
    var window;


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        q = $q;
        window = {location: jasmine.createSpy()};
        cookies['XSRF-TOKEN'] = 'TOKEN';
        mockFacebook = {
            canAutoSignIn: function () {
                autoLogin = q.defer();
                return autoLogin.promise;
            },
            initiateFBLogin: function () {
                doLogin = q.defer();
                return doLogin.promise;
            }
        };
        scope = $rootScope.$new();
        SignInCtrl = $controller('CoreBootstrapSignInCtrl', {
            $scope: scope,
            $cookies: cookies,
            $window: window,
            jtbFacebook: mockFacebook
        });
    }));

    function checkStandardStartingExpectations() {
        expect(SignInCtrl.csrf).toEqual('TOKEN');
        expect(SignInCtrl.showFacebook).toEqual(false);
        expect(SignInCtrl.showManual).toEqual(false);
        expect(SignInCtrl.message).toEqual('Initializing...');
    }

    it('initializes', function () {
        checkStandardStartingExpectations();
    });

    it('initializes and can autologin', function () {
        checkStandardStartingExpectations();
        autoLogin.resolve({auto: true, permissions: 'perm'});
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(false);
        expect(SignInCtrl.showManual).toEqual(false);
        expect(SignInCtrl.message).toEqual('Logging in via Facebook');
        expect(window.location).toEqual('/auth/facebook');
    });

    it('initializes and cannot autologin with localhost', function () {
        checkStandardStartingExpectations();
        window.location = {href: 'somethinglocalhostsomething'};
        autoLogin.resolve({auto: false, permissions: 'perm'});
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(true);
        expect(SignInCtrl.message).toEqual('');
    });

    it('errors with localhost', function () {
        checkStandardStartingExpectations();
        window.location = {href: 'somethinglocalhostsomething'};
        autoLogin.reject();
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(true);
        expect(SignInCtrl.message).toEqual('');
    });

    it('initializes and cannot autologin with -dev', function () {
        checkStandardStartingExpectations();
        window.location = {href: 'something-devsomething'};
        autoLogin.resolve({auto: false, permissions: 'perm'});
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(true);
        expect(SignInCtrl.message).toEqual('');
    });

    it('errors with -dev', function () {
        checkStandardStartingExpectations();
        window.location = {href: 'something-devsomething'};
        autoLogin.reject();
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(true);
        expect(SignInCtrl.message).toEqual('');
    });

    it('initializes and cannot autologin with non-manual, so initiates fb login', function () {
        checkStandardStartingExpectations();
        window.location = {href: 'somethingsomething'};
        angular.isUndefined(doLogin);
        autoLogin.resolve({auto: false, permissions: 'perm2'});
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(false);
        expect(SignInCtrl.message).toEqual('');
        angular.isDefined(doLogin);
        //  rest tested elsewhere
    });

    it('errors with non-manual', function () {
        checkStandardStartingExpectations();
        window.location = {href: 'somethingsomething'};
        autoLogin.reject();
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(false);
        expect(SignInCtrl.message).toEqual('');
    });

    it('pressing FB Login to success and auto-login', function () {
        SignInCtrl.fbLogin();
        doLogin.resolve({auto: true});
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(false);
        expect(SignInCtrl.showManual).toEqual(false);
        expect(SignInCtrl.message).toEqual('Logging in via Facebook');
        expect(window.location).toEqual('/auth/facebook');
    });

    it('pressing FB Login to success but not auto-login', function () {
        window.location = {href: 'somethinglocalhostsomething'};
        SignInCtrl.fbLogin();
        doLogin.resolve({auto: false});
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(true);
        expect(SignInCtrl.message).toEqual('');
    });

    it('pressing FB Login to failure', function () {
        window.location = {href: 'somethinglocalhostsomething'};
        SignInCtrl.fbLogin();
        doLogin.reject();
        scope.$apply();
        expect(SignInCtrl.showFacebook).toEqual(true);
        expect(SignInCtrl.showManual).toEqual(true);
        expect(SignInCtrl.message).toEqual('');
    });
});
