(function (angular) {

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp

    // Config
    angular.module('coreGamesBootstrapUi.config', [])
        .value('coreGamesBootstrapUi.config', {
            debug: true
        });

    // Modules
    angular.module('coreGamesBootstrapUi.controllers', []);
    angular.module('coreGamesBootstrapUi.directives', []);
    angular.module('coreGamesBootstrapUi.filters', []);
    angular.module('coreGamesBootstrapUi.services', []);
    angular.module('coreGamesBootstrapUi',
        [
            'coreGamesBootstrapUi.config',
            'coreGamesBootstrapUi.directives',
            'coreGamesBootstrapUi.filters',
            'coreGamesBootstrapUi.services',
            'coreGamesBootstrapUi.controllers',
            'ngResource',
            'ngCookies',
            'ngSanitize',
            'ui.bootstrap'
        ]);

})(angular);

'use strict';

angular.module('coreGamesBootstrapUi.controllers').controller('CoreBootstrapInviteCtrl',
    ['$uibModalInstance', '$scope', 'invitableFriends', 'message', 'jtbFacebook',
        function ($uibModalInstance, $scope, invitableFriends, message, jtbFacebook) {
            $scope.invitableFriends = invitableFriends;
            $scope.chosenFriends = [];
            $scope.message = message;
            $scope.invite = function () {
                var ids = [];
                angular.forEach($scope.chosenFriends, function (chosen) {
                    ids.push(chosen.id);
                });
                jtbFacebook.inviteFriends(ids, message);
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);


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
'use strict';

angular.module('coreGamesBootstrapUi.controllers')
    .controller('CoreBootstrapSignInCtrl',
    ['$scope', '$window', '$cookies', 'jtbFacebook',
        function ($scope, $window, $cookies, jtbFacebook) {
            $scope.message = 'Initializing...';
            $scope.showFacebook = false;
            $scope.showManual = false;
            $scope.csrf = $cookies['XSRF-TOKEN'];

            function showLoginOptions() {
                $scope.showFacebook = true;
                $scope.showManual =
                    $window.location.href.indexOf('localhost') > -1 ||
                    $window.location.href.indexOf('-dev') > -1;
                $scope.message = '';
            }

            function autoLogin() {
                $scope.showFacebook = false;
                $scope.showManual = false;
                $scope.message = 'Logging in via Facebook';
                $window.location = '/auth/facebook';
            }

            $scope.fbLogin = function () {
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
                } else {
                    autoLogin();
                }
            }, function () {
                showLoginOptions();
            });

        }]);

