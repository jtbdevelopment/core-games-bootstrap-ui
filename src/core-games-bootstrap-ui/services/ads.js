/*global invokeApplixirVideoUnitExtended:false */
'use strict';

angular.module('coreGamesBootstrapUi.services').factory('jtbBootstrapAds',
    ['$q', 'jtbBootstrapBackdropManager',
        function ($q, jtbBootstrapBackdropManager) {
            var DEFAULT_TIME_BETWEEN_ADS = 2 * 60 * 1000;  // 2 minutes
            var timeBetweenAds = DEFAULT_TIME_BETWEEN_ADS;
            var lastAd = new Date(0);
            return {
                setFrequency: function (intervalInMillis) {
                    timeBetweenAds = intervalInMillis;
                },
                showAdPopup: function () {
                    var adPromise = $q.defer();
                    if (((new Date()) - lastAd ) >= timeBetweenAds) {
                        try {
                            jtbBootstrapBackdropManager.addBackdrop();
                            invokeApplixirVideoUnitExtended(false, 'middle', function () {
                                jtbBootstrapBackdropManager.removeBackdrop();
                                adPromise.resolve();
                                lastAd = new Date();
                            });
                        } catch (ex) {
                            jtbBootstrapBackdropManager.removeBackdrop();
                            console.log(JSON.stringify(ex));
                            adPromise.resolve();
                        }
                    } else {
                        adPromise.resolve();
                    }
                    return adPromise.promise;
                }
            };
        }
    ]);
