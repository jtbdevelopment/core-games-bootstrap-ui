'use strict';

describe('', function () {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function (module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function () {

        // Get module
        module = angular.module('coreGamesBootstrapUi');
        dependencies = module.requires;
    });

    it('should load config module', function () {
        expect(hasModule('coreGamesBootstrapUi.config')).toBeTruthy();
    });

    it('should load controllers module', function () {
        expect(hasModule('coreGamesBootstrapUi.controllers')).toBeTruthy();
    });


    it('should load filters module', function () {
        expect(hasModule('coreGamesBootstrapUi.filters')).toBeTruthy();
    });


    it('should load directives module', function () {
        expect(hasModule('coreGamesBootstrapUi.directives')).toBeTruthy();
    });


    it('should load services module', function () {
        expect(hasModule('coreGamesBootstrapUi.services')).toBeTruthy();
    });


});