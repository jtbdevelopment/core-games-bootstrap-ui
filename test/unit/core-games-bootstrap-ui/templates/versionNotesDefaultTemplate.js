describe('', function () {

    beforeEach(function () {
        module('coreGamesBootstrapUi.templates');
    });


    var $templateCache;
    beforeEach(inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
    }));

    it('verify version-notes.html registered', function() {
        expect($templateCache.get('views/core-bs/version-notes/version-notes.html')).toBeDefined();
    });
});
