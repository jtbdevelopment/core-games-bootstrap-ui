/*global invokeApplixirVideoUnitExtended:false */
'use strict';

angular.module('coreGamesBootstrapUi.services').factory('jtbBootstrapAds',
    ['$q',
        function ($q) {
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
                            invokeApplixirVideoUnitExtended(false, 'middle', function () {
                                adPromise.resolve();
                                lastAd = new Date();
                            });
                        } catch (ex) {
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
