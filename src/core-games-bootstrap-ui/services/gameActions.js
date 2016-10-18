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
    ['$http', '$q', '$location', '$uibModal', 'jtbGameCache', 'jtbPlayerService',
        function ($http, $q, $location, $uibModal, jtbGameCache, jtbPlayerService) {

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

            function generalizedConfirmedTakeHttpAction(confirmMessage, httpActionCB, successCB) {
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
                if (angular.isDefined(htmlConfirmDialogTemplate)) {
                    params.templateUrl = htmlConfirmDialogTemplate;
                } else {
                    params.template = defaultConfirmDialog;
                }
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
                wrapActionOnGame: function (httpActionCB) {
                    return generalizeTakeActionPromiseHandler(httpActionCB);
                },
                wrapConfirmedActionOnGame: function (confirmMessage, httpActionCB) {
                    return generalizedConfirmedTakeHttpAction(confirmMessage, httpActionCB);
                },

                //  Standard actions
                new: function (options) {
                    this.wrapActionOnGame($http.post(jtbPlayerService.currentPlayerBaseURL() + '/new', options)).then(
                        function (game) {
                            $location.path('/game/' + game.gamePhase.toLowerCase() + '/' + game.id);
                        }
                    );
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
                    this.wrapActionOnGame(standardHttpAction(game, 'rematch')).then(function (game) {
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


