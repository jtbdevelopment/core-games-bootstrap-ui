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