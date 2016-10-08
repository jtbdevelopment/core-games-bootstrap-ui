describe('', function () {

    beforeEach(function () {
        module('coreGamesBootstrapUi.templates');
    });


    var $templateCache;
    beforeEach(inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
    }));

    it('verify sign-in.html registered', function() {
        expect($templateCache.get('views/core-bs/sign-in/sign-in.html')).toBeDefined();
    });

    it('verify signed-in.html registered', function() {
        expect($templateCache.get('views/core-bs/sign-in/signed-in.html')).toBeDefined();
    });
});
