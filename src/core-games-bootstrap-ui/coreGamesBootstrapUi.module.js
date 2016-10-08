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
