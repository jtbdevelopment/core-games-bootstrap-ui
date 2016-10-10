describe('', function () {

    beforeEach(function () {
        module('coreGamesBootstrapUi.templates');
    });


    var $templateCache;
    beforeEach(inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
    }));

    it('verify invite-friends.html registered', function() {
        expect($templateCache.get('views/core-bs/friends/invite-friends.html')).toBeDefined();
    });
});
