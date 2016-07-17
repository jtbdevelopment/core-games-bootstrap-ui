'use strict';

angular.module('coreGamesBootstrapUi.controllers')
    .controller('CoreBootstrapSignedInCtrl',
        ['$location', '$rootScope', '$cacheFactory',
            function ($location, $rootScope, $cacheFactory) {

                function clearHttpCache() {
                    $cacheFactory.get('$http').removeAll();
                }

                function onSuccessfulLogin() {
                    console.log('Logged in');
                    clearHttpCache();
                    $rootScope.$broadcast('login');
                    $location.path('/main');
                }

                onSuccessfulLogin();

            }
        ]
    );