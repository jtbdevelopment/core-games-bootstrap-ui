describe('', function () {

    beforeEach(function () {
        module('coreGamesBootstrapUi.templates');
    });


    var $templateCache;
    beforeEach(inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
    }));

    it('verify action-error-dialog registered', function() {
        expect($templateCache.get('views/core-bs/actions/action-error-dialog.html')).toBeDefined();
    });

    it('verify action-confirm-dialog registered', function() {
        expect($templateCache.get('views/core-bs/actions/action-confirm-dialog.html')).toBeDefined();
    });
});
