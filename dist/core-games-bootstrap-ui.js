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


/*global invokeApplixirVideoUnitExtended:false */
'use strict';

angular.module('coreGamesBootstrapUi.services').factory('jtbBootstrapAds',
    ['$q', 'jtbBootstrapBackdropManager',
        function ($q, jtbBootstrapBackdropManager) {
            var DEFAULT_TIME_BETWEEN_ADS = 2 * 60 * 1000;  // 2 minutes
            var timeBetweenAds = DEFAULT_TIME_BETWEEN_ADS;
            var lastAd = new Date(0);
            return {
                setFrequency: function (intervalInMillis) {
                    timeBetweenAds = intervalInMillis;
                },
                showAdPopup: function () {
                    var adPromise = $q.defer();
                    if (((new Date()) - lastAd ) >= timeBetweenAds) {
                        try {
                            jtbBootstrapBackdropManager.addBackdrop();
                            invokeApplixirVideoUnitExtended(false, 'middle', function () {
                                jtbBootstrapBackdropManager.removeBackdrop();
                                adPromise.resolve();
                                lastAd = new Date();
                            });
                        } catch (ex) {
                            jtbBootstrapBackdropManager.removeBackdrop();
                            console.log(JSON.stringify(ex));
                            adPromise.resolve();
                        }
                    } else {
                        adPromise.resolve();
                    }
                    return adPromise.promise;
                }
            };
        }
    ]);

'use strict';

//  Largely adapted from https://github.com/angular-ui/bootstrap/blob/master/src/modal/modal.js
//  But to not actually require a modal window
angular.module('coreGamesBootstrapUi.services').factory('jtbBootstrapBackdropManager',
    ['$animate', '$document',  '$compile', '$rootScope',
        function ($animate, $document, $compile, $rootScope) {
            var counter = 0;
            var BODY_CLASS = 'modal-open';
            var backdropDomEl;
            var backdropScope = $rootScope.$new(true);
            backdropScope.index = 1;

            function setupBackdrop() {
                if(angular.isDefined(backdropDomEl)) {
                    return;
                }
                var body = $document.find('body').eq(0);
                backdropDomEl = angular.element('<div id="jtb-backdrop" uib-modal-backdrop="modal-backdrop"></div>');
                backdropDomEl.attr({
                    'class': 'modal-backdrop',
                    'ng-style': '{\'z-index\': 1040 + (index && 1 || 0) + index*10}',
                    'uib-modal-animation-class': 'fade',
                    'modal-in-class': 'in'
                });
                backdropDomEl.attr('modal-animation', 'true');
                body.addClass(BODY_CLASS);
                $compile(backdropDomEl)(backdropScope);
                $animate.enter(backdropDomEl, body);
            }

            function removeBackdrop() {
                if (angular.isUndefined(backdropDomEl)) {
                    return;
                }
                var body = $document.find('body').eq(0);
                $animate.leave(backdropDomEl).then(function () {
                    body.removeClass(BODY_CLASS);
                    backdropDomEl = undefined;
                });
            }

            return {
                addBackdrop: function () {
                    counter += 1;
                    if (counter === 1) {
                        setupBackdrop();
                    }
                },
                removeBackdrop: function () {
                    counter -= 1;
                    if (counter === 0) {
                        removeBackdrop();
                    }
                }

            };
        }
    ]
);
'use strict';

angular.module('coreGamesBootstrapUi.services').run(
    ['$rootScope', '$location', '$uibModal',
        function ($rootScope, $location, $uibModal) {
            function ErrorDialogController($uibModalInstance) {
                var controller = this;
                controller.closeError = function () {
                    $uibModalInstance.close();
                    $location.path('/signin');
                };
            }

            var params = {
                controller: ['$uibModalInstance', ErrorDialogController],
                controllerAs: 'errorDialog',
                templateUrl: 'views/core-bs/errors/error-dialog.html'
            };

            function showErrorAndReconnect() {
                $uibModal.open(params);
            }

            $rootScope.$on('InvalidSession', function () {
                showErrorAndReconnect();
            });
            $rootScope.$on('GeneralError', function () {
                showErrorAndReconnect();
            });
        }
    ]
);
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
    ['$http', '$q', '$location', '$uibModal', 'jtbGameCache',
        'jtbPlayerService', 'jtbBootstrapAds', 'jtbBootstrapBackdropManager',
        function ($http, $q, $location, $uibModal, jtbGameCache,
                  jtbPlayerService, jtbBootstrapAds, jtbBootstrapBackdropManager) {

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

            var htmlErrorDialogTemplate = 'views/core-bs/actions/action-error-dialog.html';
            var htmlConfirmDialogTemplate = 'views/core-bs/actions/action-confirm-dialog.html';

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
                params.templateUrl = htmlErrorDialogTemplate;
                $uibModal.open(params);
            }

            var errorHandler = defaultErrorCallback;
            var defaultAdHandler = jtbBootstrapAds.showAdPopup;

            function gameURL(game) {
                return jtbPlayerService.currentPlayerBaseURL() + '/game/' + game.id + '/';
            }

            function showSending() {
                jtbBootstrapBackdropManager.addBackdrop();
            }

            function hideSending() {
                jtbBootstrapBackdropManager.removeBackdrop();
            }

            function generalizeTakeActionPromiseHandler(httpPromise) {
                var promise = $q.defer();
                showSending();
                httpPromise.then(
                    function (response) {
                        var updatedGame = response.data;
                        hideSending();
                        jtbGameCache.putUpdatedGame(updatedGame);
                        promise.resolve(updatedGame);
                    },
                    function (response) {
                        console.error(response.data + '/' + response.status);
                        hideSending();
                        errorHandler(response.data);
                        promise.reject();
                    }
                );
                return promise.promise;
            }

            function generalizedConfirmedTakeHttpAction(confirmMessage, httpActionCB) {
                var promise = $q.defer();
                var params = {
                    controller: ['$uibModalInstance', 'message', ConfirmDialogController],
                    controllerAs: 'confirmDialog',
                    resolve: {
                        message: function () {
                            return confirmMessage;
                        }
                    }
                };
                params.templateUrl = htmlConfirmDialogTemplate;
                $uibModal.open(params).result.then(function () {
                        generalizeTakeActionPromiseHandler(httpActionCB()).then(function (updatedGame) {
                            promise.resolve(updatedGame);
                        }, function () {
                            promise.reject();
                        });
                    },
                    function () {
                        promise.reject();
                    }
                );
                return promise.promise;
            }


            function standardHttpAction(game, action) {
                return $http.put(gameURL(game) + action);
            }

            function generateAd(adHandler) {
                if (angular.isUndefined(adHandler)) {
                    adHandler = defaultAdHandler;
                }
                return adHandler();
            }

            var service = {
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
                wrapActionOnGame: function (httpActionCB) {
                    return generalizeTakeActionPromiseHandler(httpActionCB);
                },
                wrapConfirmedActionOnGame: function (confirmMessage, httpActionCB) {
                    return generalizedConfirmedTakeHttpAction(confirmMessage, httpActionCB);
                },

                //  Standard actions

                //  adHandler will default if undefined
                new: function (options, adHandler) {
                    generateAd(adHandler).then(function () {
                        service.wrapActionOnGame($http.post(
                            jtbPlayerService.currentPlayerBaseURL() + '/new',
                            options)).then(
                            function (game) {
                                $location.path('/game/' + game.gamePhase.toLowerCase() + '/' + game.id);
                            }
                        );
                    });
                },

                //  adHandler will default if undefined
                accept: function (game, adHandler) {
                    generateAd(adHandler).then(function () {
                        service.wrapActionOnGame(standardHttpAction(game, 'accept'));
                    });
                },

                reject: function (game) {
                    service.wrapConfirmedActionOnGame('Reject this game!', function () {
                        return standardHttpAction(game, 'reject');
                    });
                },

                declineRematch: function (game) {
                    service.wrapConfirmedActionOnGame('Decline further rematches.', function () {
                        return standardHttpAction(game, 'endRematch');
                    });
                },

                //  adHandler will default if undefined
                rematch: function (game, adHandler) {
                    generateAd(adHandler).then(function () {
                        service.wrapActionOnGame(standardHttpAction(game, 'rematch')).then(function (game) {
                            $location.path('/game/' + game.gamePhase.toLowerCase() + '/' + game.id);
                        });
                    });
                },

                quit: function (game) {
                    service.wrapConfirmedActionOnGame('Quit this game!', function () {
                        return standardHttpAction(game, 'quit');
                    });
                }
            };
            return service;
        }
    ]
);



'use strict';

angular.module('coreGamesBootstrapUi.services').factory('jtbBootstrapVersionNotesService',
    ['$uibModal', 'jtbPlayerService',
        function ($uibModal, jtbPlayerService) {
            function VersionDialogController($uibModalInstance, currentVersion, releaseNotes) {
                var controller = this;
                controller.currentVersion = currentVersion;
                controller.releaseNotes = releaseNotes;
                controller.close = function () {
                    $uibModalInstance.close();
                };
            }

            return {
                displayVersionNotesIfAppropriate: function (currentVersion, releaseNotes, modalTemplate) {
                    if (angular.isUndefined(modalTemplate)) {
                        modalTemplate = 'views/core-bs/version-notes/version-notes.html';
                    }

                    if (jtbPlayerService.currentPlayer().lastVersionNotes < currentVersion) {
                        var params = {
                            controller: [
                                '$uibModalInstance',
                                'currentVersion',
                                'releaseNotes',
                                VersionDialogController],
                            controllerAs: 'versionDialog',
                            templateUrl: modalTemplate,
                            resolve: {
                                currentVersion: function () {
                                    return currentVersion;
                                },
                                releaseNotes: function () {
                                    return releaseNotes;
                                }
                            }
                        };
                        $uibModal.open(params);
                        jtbPlayerService.updateLastVersionNotes(currentVersion);
                    }
                }
            };
        }
    ]
);
angular.module('coreGamesBootstrapUi.templates').run(['$templateCache', function($templateCache) {$templateCache.put('views/core-bs/actions/action-confirm-dialog.html','<div class="game-confirm-dialog"><div class="modal-header"><h4 class="modal-title">{{confirmDialog.confirmMessage}}</h4></div><div class="modal-body"><span class="confirm-message">Are you sure?</span></div><div class="modal-footer"><button class="btn btn-default btn-danger action-button" ng-click="confirmDialog.takeAction()">Yes</button> <button class="btn btn-default btn-default btn-default-focus cancel-button" ng-click="confirmDialog.cancelAction()">No</button></div></div>');
$templateCache.put('views/core-bs/actions/action-error-dialog.html','<div class="game-error-dialog" role="dialog"><div class="modal-header"><h4 class="modal-title">Sorry!</h4></div><div class="modal-body"><span class="error-message">{{errorDialog.errorMessage}}</span></div><div class="modal-footer"><button class="btn btn-default btn-info btn-default-focus close-button" ng-click="errorDialog.closeError()">OK</button></div></div>');
$templateCache.put('views/core-bs/admin/admin-stats.html','<div class="admin-stats"><div class="row"><table class="table table-striped table-condensed table-admin-states"><tr><th></th><th class="text-right">Last 24 hours</th><th class="text-right">Last 7 days</th><th class="text-right">Last 30 days</th></tr><tr class="text-right"><th class="text-left">Total Games</th><td colspan="3">{{admin.gameCount}}</td></tr><tr class="text-right"><th class="text-left">Games Created</th><td>{{admin.gamesLast24hours}}</td><td>{{admin.gamesLast7days}}</td><td>{{admin.gamesLast30days}}</td></tr><tr class="text-right"><th class="text-left">Total Players</th><td colspan="3">{{admin.playerCount}}</td></tr><tr class="text-right"><th class="text-left">Players Created</th><td>{{admin.playersCreated24hours}}</td><td>{{admin.playersCreated7days}}</td><td>{{admin.playersCreated30days}}</td></tr><tr class="text-right"><th class="text-left">Players Logged In</th><td>{{admin.playersLastLogin24hours}}</td><td>{{admin.playersLastLogin7days}}</td><td>{{admin.playersLastLogin30days}}</td></tr></table></div></div>');
$templateCache.put('views/core-bs/admin/admin-switch-player.html','<div class="admin-user"><div class="row"><div class="col-xs-4"><button class="btn btn-default btn-default-focus btn-success btn-stop-simulating" ng-disabled="!admin.revertEnabled" ng-click="admin.revertToNormal()">Stop</button></div><div class="col-xs-8">{{admin.revertText}}</div></div><div class="row"><div class="col-xs-4"><button class="btn btn-default btn-default-focus btn-primary btn-get-users" ng-click="admin.refreshData()">Get Users</button></div><div class="col-xs-8"><input class="form-control" type="text" ng-model="admin.searchText" placeholder="And Name contains.."></div></div><div class="row"><div class="col-xs-12"><table class="table table-striped table-condensed table-admin-users"><tr><th>Display Name</th><th>ID</th><th>Switch</th></tr><tr ng-repeat="player in admin.players"><td>{{player.displayName}}</td><td>{{player.id}}</td><td><button class="btn btn-danger btn-danger btn-change-user" ng-click="admin.switchToPlayer(player.id)">Switch to this user..</button></td></tr></table></div></div><div class="row"><div class="col-xs-12"><ul uib-pagination num-pages="admin.numberOfPages" items-per-page="admin.pageSize" direction-links="false" total-items="admin.totalItems" ng-model="admin.currentPage" ng-change="admin.changePage()"></ul></div></div></div>');
$templateCache.put('views/core-bs/admin/admin.html','<div class="admin-screen"><div class="row"><div class="col-xs-8 col-xs-offset-2"><uib-tabset type="tabs" justified="true"><uib-tab heading="Stats"><div ng-include="\'views/core-bs/admin/admin-stats.html\'"></div></uib-tab><uib-tab heading="Switch player"><div ng-include="\'views/core-bs/admin/admin-switch-player.html\'"></div></uib-tab></uib-tabset></div></div></div>');
$templateCache.put('views/core-bs/errors/error-dialog.html','<div class="general-error-dialog" role="dialog"><div class="modal-header"><h4 class="modal-title">Sorry!</h4></div><div class="modal-body"><span class="error-message">Something has gone wrong, going to try to re-login and reset.</span></div><div class="modal-footer"><button class="btn btn-default btn-info btn-default-focus close-button" ng-click="errorDialog.closeError()">OK</button></div></div>');
$templateCache.put('views/core-bs/friends/invite-friends.html','<div class="invite-dialog"><div class="modal-header"><h3 class="modal-title">Invite Friends to Play</h3></div><div class="modal-body"><ui-select multiple="multiple" ng-model="invite.chosenFriends" theme="bootstrap" reset-search-input="true"><ui-select-match placeholder="Select friends...">{{$item.name}}</ui-select-match><ui-select-choices repeat="friend in invite.invitableFriends | propsFilter: {name: $select.search}"><div ng-bind-html="friend.name | highlight: $select.search"></div></ui-select-choices></ui-select></div><div class="modal-footer"><button class="btn btn-primary" ng-click="invite.invite()">Invite</button> <button class="btn btn-warning" ng-click="invite.cancel()">Cancel</button></div></div>');
$templateCache.put('views/core-bs/sign-in/sign-in.html','<div class="sign-in ng-cloak"><div class="container-fluid"><div class="row text-center"><div class="center"><p>{{signIn.message}}</p></div></div></div><div class="container-fluid" ng-show="signIn.showFacebook"><div class="row text-center"><div class="center"><a href="#" ng-click="signIn.fbLogin()"><img ng-src="/images/sign-in-with-facebook.png"></a></div></div></div><div class="container-fluid" ng-show="signIn.showManual"><div class="row text-center"><p>Don\'t want to login with Facebook?</p><form id="signin" action="/signin/authenticate" method="post" class="form-group"><input id="_csrf" name="_csrf" type="hidden" value="{{csrf}}"><div class="form-group"><label for="username">Username</label><input id="username" name="username" type="text" size="25"></div><div class="form-group"><label for="password">Password</label><input id="password" name="password" type="password" size="25"></div><div class="form-group"><div class="checkbox"><label><input type="checkbox" id="remember-me" name="remember-me"> Remember me</label></div></div><div class="form-group"><button type="submit" class="btn btn-default">Sign in</button></div></form></div></div></div>');
$templateCache.put('views/core-bs/sign-in/signed-in.html','<div class="row signed-in"><div class="row text-center"><div class="center"><p>Login successful...</p></div></div></div>');
$templateCache.put('views/core-bs/version-notes/version-notes.html','<div class="version-dialog"><div class="modal-header"><h3 class="modal-title">Welcome to version {{versionDialog.currentVersion}}</h3></div><div class="modal-body"><span class="version-message">{{versionDialog.releaseNotes}}</span></div><div class="modal-footer"><button class="btn btn-default btn-info btn-default-focus close-button" ng-click="versionDialog.close()">OK</button></div></div>');}]);