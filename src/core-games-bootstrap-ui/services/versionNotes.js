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