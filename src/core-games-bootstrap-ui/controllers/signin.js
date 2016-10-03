'use strict';

angular.module('coreGamesBootstrapUi.controllers')
    .controller('CoreBootstrapSignInCtrl',
    ['$window', '$cookies', 'jtbFacebook',
        function ($window, $cookies, jtbFacebook) {
            var controller = this;
            controller.message = 'Initializing...';
            controller.showFacebook = false;
            controller.showManual = false;
            controller.csrf = $cookies['XSRF-TOKEN'];

            function showLoginOptions() {
                controller.showFacebook = true;
                controller.showManual =
                    $window.location.href.indexOf('localhost') > -1 ||
                    $window.location.href.indexOf('-dev') > -1;
                controller.message = '';
            }

            function autoLogin() {
                controller.showFacebook = false;
                controller.showManual = false;
                controller.message = 'Logging in via Facebook';
                $window.location = '/auth/facebook';
            }

            controller.fbLogin = function () {
                jtbFacebook.initiateFBLogin().then(function (details) {
                    if (!details.auto) {
                        showLoginOptions();
                    } else {
                        autoLogin();
                    }
                }, function () {
                    showLoginOptions();
                });
            };

            jtbFacebook.canAutoSignIn().then(function (details) {
                if (!details.auto) {
                    showLoginOptions();
                    if(controller.showFacebook && !controller.showManual) {
                        controller.fbLogin();
                    }
                } else {
                    autoLogin();
                }
            }, function () {
                showLoginOptions();
            });

        }]);

