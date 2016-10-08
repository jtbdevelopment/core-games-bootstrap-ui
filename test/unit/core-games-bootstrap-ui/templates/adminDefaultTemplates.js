describe('', function () {

    beforeEach(function () {
        module('coreGamesBootstrapUi.templates');
    });


    var $templateCache;
    beforeEach(inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
    }));

    it('verify admin-switch-player.html registered', function() {
        expect($templateCache.get('views/core-bs/admin/admin-switch-player.html')).toBeDefined();
    });

    it('verify admin-stats.html registered', function() {
        expect($templateCache.get('views/core-bs/admin/admin-stats.html')).toBeDefined();
    });

    it('verify admin.html registered', function() {
       expect($templateCache.get('views/core-bs/admin/admin.html')).toBeDefined();
    });
});
