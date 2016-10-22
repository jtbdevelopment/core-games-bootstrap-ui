'use strict';

angular.module('coreGamesBootstrapUi.templates').run(
    ['$templateCache',
        function ($templateCache) {
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
            $templateCache.put('views/core-bs/admin/admin-switch-player.html', '' +
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
                '<div ng-include="\'views/core-bs/admin/admin-switch-player.html\'">' +
                '</div>' +
                '</uib-tab></uib-tabset></div></div></div>');
        }
    ]
);