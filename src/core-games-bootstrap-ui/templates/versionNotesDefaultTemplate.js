'use strict';

angular.module('coreGamesBootstrapUi.templates').run(
    ['$templateCache',
        function ($templateCache) {
            $templateCache.put('views/core-bs/version-notes/version-notes.html', '' +
                '<div class="version-dialog">' +
                '<div class="modal-header">' +
                '<h3 class="modal-title">Welcome to version {{versionDialog.currentVersion}}</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                '<span class="version-message">{{versionDialog.releaseNotes}}</span>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-default btn-info btn-default-focus close-button" ' +
                'ng-click="versionDialog.close()">OK</button>' +
                '</div>' +
                '</div>'
            );
        }
    ]
);