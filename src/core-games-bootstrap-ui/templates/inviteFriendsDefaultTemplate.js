'use strict';

angular.module('coreGamesBootstrapUi.templates').run(
    ['$templateCache',
        function ($templateCache) {
            $templateCache.put('views/core-bs/friends/invite-friends.html', '' +
                '<div class="invite-dialog">' +
                '<div class="modal-header">' +
                '<h3 class="modal-title">Invite Friends to Play</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                '<ui-select multiple ng-model="invite.chosenFriends" theme="bootstrap" reset-search-input="true">' +
                '<ui-select-match placeholder="Select friends...">{{$item.name}}</ui-select-match>' +
                '<ui-select-choices repeat="friend in invite.invitableFriends | propsFilter: {name: $select.search}">' +
                '<div ng-bind-html="friend.name | highlight: $select.search"></div>' +
                '</ui-select-choices>' +
                '</ui-select>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-primary" ng-click="invite.invite()">Invite</button>' +
                '<button class="btn btn-warning" ng-click="invite.cancel()">Cancel</button>' +
                '</div>' +
                '</div>'
            );
        }
    ]
);