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

            var htmlErrorDialogTemplate = 'views/core-bs/actions/default-action-error-dialog.html';
            var htmlConfirmDialogTemplate = 'views/core-bs/actions/default-action-confirm-dialog.html';

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


