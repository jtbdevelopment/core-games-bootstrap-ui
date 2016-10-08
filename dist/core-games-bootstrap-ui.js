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
    angular.module('coreGamesBootstrapUi.templates', []);
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
            'coreGamesBootstrapUi.templates',
            'coreGamesBootstrapUi.controllers',
            'ngResource',
            'ngCookies',
            'ngSanitize',
            'ui.bootstrap'
        ]);

})(angular);

'use strict';

angular.module('coreGamesBootstrapUi.controllers').controller('CoreBootstrapInviteCtrl',
    ['$uibModalInstance', 'invitableFriends', 'message', 'jtbFacebook',
        function ($uibModalInstance, invitableFriends, message, jtbFacebook) {
            var controller = this;
            controller.invitableFriends = invitableFriends;
            controller.chosenFriends = [];
            controller.message = message;
            controller.invite = function () {
                var ids = [];
                angular.forEach(controller.chosenFriends, function (chosen) {
                    ids.push(chosen.id);
                });
                jtbFacebook.inviteFriends(ids, message);
                $uibModalInstance.close();
            };
            controller.cancel = function () {
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
                } else {
                    autoLogin();
                }
            }, function () {
                showLoginOptions();
            });

        }]);


'use strict';

/**
 * Error Handling
 * --------------
 * To change look of dialog - override path to template with setErrorDialogHTMLTemplate
 * OR
 * override error handler with setErrorHandler which takes 1 param with error message
 *
 * Actions Requiring Confirmation
 * ------------------------------
 * To change look of dialog - override path to template with setConfirmDialogHTMLTemplate
 *
 * Game Specific Actions
 * ---------------------
 * You can use wrapActionOnGame and wrapConfirmedActionOnGame to create standard handlers for game calls,
 * cache interaction and error handling
 */
angular.module('coreGamesBootstrapUi.services').factory('jtbBootstrapGameActions',
    ['$http', '$location', '$uibModal', 'jtbGameCache', 'jtbPlayerService',
        function ($http, $location, $uibModal, jtbGameCache, jtbPlayerService) {

            function ErrorDialogController($uibModalInstance, message) {
                var controller = this;
                controller.errorMessage = message;
                controller.closeError = function () {
                    $uibModalInstance.close();
                };
            }

            function ConfirmDialogController($uibModalInstance, message) {
                var controller = this;
                controller.confirmMessage = message;
                controller.takeAction = function () {
                    $uibModalInstance.close();
                };
                controller.cancelAction = function () {
                    $uibModalInstance.dismiss();
                };
            }

            var defaultErrorDialog =
                '<div class="game-error-dialog" role="dialog">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title">Sorry!</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<span class="error-message">{{errorDialog.errorMessage}}</span>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-default btn-info btn-default-focus close-button" ' +
                'ng-click="errorDialog.closeError()">OK</button>' +
                '</div>' +
                '</div>';
            var defaultConfirmDialog =
                '<div class="game-confirm-dialog">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title">{{confirmDialog.confirmMessage}}</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<span class="confirm-message">Are you sure?</span>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-default btn-danger action-button" ' +
                'ng-click="confirmDialog.takeAction()">Yes</button>' +
                '<button class="btn btn-default btn-default btn-default-focus cancel-button" ' +
                'ng-click="confirmDialog.cancelAction()">No</button>' +
                '</div>' +
                '</div>';
            var htmlErrorDialogTemplate;
            var htmlConfirmDialogTemplate;

            function defaultErrorCallback(errorMessage) {
                var params = {
                    controller: ['$uibModalInstance', 'message', ErrorDialogController],
                    controllerAs: 'errorDialog',
                    resolve: {
                        message: function () {
                            return errorMessage;
                        }
                    }
                };
                if (angular.isDefined(htmlErrorDialogTemplate)) {
                    params.templateUrl = htmlErrorDialogTemplate;
                } else {
                    params.template = defaultErrorDialog;
                }
                $uibModal.open(params);
            }

            var errorHandler = defaultErrorCallback;

            function gameURL(game) {
                return jtbPlayerService.currentPlayerBaseURL() + '/game/' + game.id + '/';
            }

            function showSending() {
                //  TODO
            }

            function hideSending() {
                //  TODO
            }

            function generalizeTakeActionPromiseHandler(httpPromise, successCB) {
                showSending();
                httpPromise.success(
                    function (updatedGame) {
                        hideSending();
                        jtbGameCache.putUpdatedGame(updatedGame);
                        if (angular.isDefined(successCB)) {
                            successCB(updatedGame);
                        }
                    }
                ).error(
                    function (data, status) {
                        console.error(data + '/' + status);
                        hideSending();
                        errorHandler(data);
                    }
                );
            }

            function generalizedConfirmedTakeHttpAction(confirmMessage, httpActionCB, successCB) {
                var params = {
                    controller: ['$uibModalInstance', 'message', ConfirmDialogController],
                    controllerAs: 'confirmDialog',
                    resolve: {
                        message: function () {
                            return confirmMessage;
                        }
                    }
                };
                if (angular.isDefined(htmlConfirmDialogTemplate)) {
                    params.templateUrl = htmlConfirmDialogTemplate;
                } else {
                    params.template = defaultConfirmDialog;
                }
                $uibModal.open(params).result.then(function () {
                        generalizeTakeActionPromiseHandler(httpActionCB(), successCB);
                    }
                );
            }


            function standardHttpAction(game, action) {
                return $http.put(gameURL(game) + action);
            }

            return {
                //  Override error handler
                getErrorHandler: function () {
                    return errorHandler;
                },

                setErrorHandler: function (cb) {
                    errorHandler = cb;
                },

                setConfirmDialogHTMLTemplate: function (htmlConfirmDialogOverride) {
                    htmlConfirmDialogTemplate = htmlConfirmDialogOverride;
                },

                setErrorDialogHTMLTemplate: function (htmlErrorTemplateOverride) {
                    htmlErrorDialogTemplate = htmlErrorTemplateOverride;
                },

                //  Helpers for defining game specific actions
                getGameURL: function (game) {
                    return gameURL(game);
                },
                wrapActionOnGame: function (httpActionCB, successCB) {
                    generalizeTakeActionPromiseHandler(httpActionCB, successCB);
                },
                wrapConfirmedActionOnGame: function (confirmMessage, httpActionCB, successCB) {
                    generalizedConfirmedTakeHttpAction(confirmMessage, httpActionCB, successCB);
                },

                //  Standard actions
                new: function (options) {
                    this.wrapActionOnGame(
                        $http.post(jtbPlayerService.currentPlayerBaseURL() + '/new', options),
                        function (game) {
                            $location.path('/game/' + game.gamePhase.toLowerCase() + '/' + game.id);
                        });
                },

                accept: function (game) {
                    this.wrapActionOnGame(standardHttpAction(game, 'accept'));
                },

                reject: function (game) {
                    this.wrapConfirmedActionOnGame('Reject this game!', function () {
                        return standardHttpAction(game, 'reject');
                    });
                },

                declineRematch: function (game) {
                    this.wrapConfirmedActionOnGame('Decline further rematches.', function () {
                        return standardHttpAction(game, 'endRematch');
                    });
                },

                rematch: function (game) {
                    this.wrapActionOnGame(standardHttpAction(game, 'rematch'), function (game) {
                        $location.path('/game/' + game.gamePhase.toLowerCase() + '/' + game.id);
                    });
                },

                quit: function (game) {
                    this.wrapConfirmedActionOnGame('Quit this game!', function () {
                        return standardHttpAction(game, 'quit');
                    });
                }
            };
        }
    ]
);



'use strict';

angular.module('coreGamesBootstrapUi.templates').run(function ($templateCache) {
    $templateCache.put('views/core-bs/admin/admin-stats.html', '' +
        '<div class="admin-stats"><div class="row">' +
        '<table class="table table-striped table-condensed table-admin-states"> ' +
        '<tr> ' +
        '<th></th> ' +
        '<th class="text-right">Last 24 hours</th> ' +
        '<th class="text-right">Last 7 days</th> ' +
        '<th class="text-right">Last 30 days</th> ' +
        '</tr> ' +
        '<tr class="text-right"> ' +
        '<th class="text-left">Total Games</th> ' +
        '<td colspan="3">{{admin.gameCount}}</td> ' +
        '</tr> ' +
        '<tr class="text-right"> ' +
        '<th class="text-left">Games Created</th> ' +
        '<td>{{admin.gamesLast24hours}}</td> ' +
        '<td>{{admin.gamesLast7days}}</td> ' +
        '<td>{{admin.gamesLast30days}}</td> ' +
        '</tr> ' +
        '<tr class="text-right"> ' +
        '<th class="text-left">Total Players</th> ' +
        '<td colspan="3">{{admin.playerCount}}</td> ' +
        '</tr> ' +
        '<tr class="text-right"> ' +
        '<th class="text-left">Players Created</th> ' +
        '<td>{{admin.playersCreated24hours}}</td> ' +
        '<td>{{admin.playersCreated7days}}</td> ' +
        '<td>{{admin.playersCreated30days}}</td> ' +
        '</tr> ' +
        '<tr class="text-right"> ' +
        '<th class="text-left">Players Logged In</th> ' +
        '<td>{{admin.playersLastLogin24hours}}</td> ' +
        '<td>{{admin.playersLastLogin7days}}</td> ' +
        '<td>{{admin.playersLastLogin30days}}</td> ' +
        '</tr> ' +
        '</table> ' +
        '</div> ' +
        '</div>');
    $templateCache.put('views/core-bs/admin/admin-switchplayer.html', '' +
        '<div class="admin-user">' +
        '<div class="row">' +
        '<div class="col-xs-4">' +
        '<button class="btn btn-default btn-default-focus btn-success btn-stop-simulating"' +
        'ng-disabled="!admin.revertEnabled" ng-click="admin.revertToNormal()">Stop</button>' +
        '</div>' +
        '<div class="col-xs-8">{{admin.revertText}}</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-xs-4">' +
        '<button class="btn btn-default btn-default-focus btn-primary btn-get-users"' +
        'ng-click="admin.refreshData()">Get Users</button>' +
        '</div>' +
        '<div class="col-xs-8">' +
        '<input class="form-control" type="text" ng-model="admin.searchText"' +
        'placeholder="And Name contains..">' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-xs-12">' +
        '<table class="table table-striped table-condensed table-admin-users">' +
        '<tr>' +
        '<th>Display Name</th>' +
        '<th>ID</th>' +
        '<th>Switch</th>' +
        '</tr>' +
        '<tr ng-repeat="player in admin.players">' +
        '<td>{{player.displayName}}</td>' +
        '<td>{{player.id}}</td>' +
        '<td>' +
        '<button class="btn btn-danger btn-danger btn-change-user"' +
        'ng-click="admin.switchToPlayer(player.id)">Switch to this user..</button>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-xs-12">' +
        '<ul uib-pagination num-pages="admin.numberOfPages" items-per-page="admin.pageSize"' +
        'direction-links="false" total-items="admin.totalItems" ng-model="admin.currentPage"' +
        'ng-change="admin.changePage()"></ul>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
    $templateCache.put('views/core-bs/admin/admin.html', '' +
        '<div class="admin-screen">' +
        '<div class="row"><div class="col-xs-8 col-xs-offset-2">' +
        '<uib-tabset type="tabs" justified="true">' +
        '<uib-tab heading="Stats">' +
        '<div ng-include="\'views/core-bs/admin/admin-stats.html\'"></div>' +
        '</uib-tab><uib-tab heading="Switch player">' +
        '<div ng-include="\'views/core-bs/admin/admin-switchplayer.html\'">' +
        '</div>' +
        '</uib-tab></uib-tabset></div></div></div>');
});