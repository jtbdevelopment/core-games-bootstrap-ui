describe('', function () {

    beforeEach(function () {
        module('coreGamesBootstrapUi.templates');
    });


    var $templateCache;
    beforeEach(inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
    }));

    it('verify general error-dialog registered', function() {
        expect($templateCache.get('views/core-bs/errors/error-dialog.html')).toBeDefined();
    });
});
