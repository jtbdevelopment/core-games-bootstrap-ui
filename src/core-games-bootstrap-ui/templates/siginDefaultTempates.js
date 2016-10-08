'use strict';

angular.module('coreGamesBootstrapUi.templates').run(function ($templateCache) {
    $templateCache.put('views/core-bs/sign-in/sign-in.html', '' +
        '<div class="sign-in ng-cloak">' +
        '<div class="container-fluid">' +
        '<div class="row text-center">' +
        '<div class="center">' +
        '<p>{{signIn.message}}</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="container-fluid" ng-show="signIn.showFacebook">' +
        '<div class="row text-center">' +
        '<div class="center">' +
        '<a href="#" ng-click="signIn.fbLogin()"><img ng-src="/images/sign-in-with-facebook.png"/></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="container-fluid" ng-show="signIn.showManual">' +
        '<div class="row text-center">' +
        '<p>Don\'t want to login with Facebook?</p>' +
        '<form id="signin" action="/signin/authenticate" method="post" class="form-group">' +
        '<input id="_csrf" name="_csrf" type="hidden" value="{{csrf}}"/>' +
        '<div class="form-group">' +
        '<label for="username">Username</label>' +
        '<input id="username" name="username" type="text" size="25"/>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="password">Password</label>' +
        '<input id="password" name="password" type="password" size="25"/>' +
        '</div>' +
        '<div class="form-group">' +
        '<div class="checkbox">' +
        '<label>' +
        '<input type="checkbox" id="remember-me" name="remember-me"> Remember me' +
        '</label>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<button type="submit" class="btn btn-default">Sign in</button>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
    $templateCache.put('views/core-bs/sign-in/signed-in.html', '' +
        '<div class="row signed-in">' +
        '<div class="row text-center">' +
        '<div class="center">' +
        '<p>Login successful...</p>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
});