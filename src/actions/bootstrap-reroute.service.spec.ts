import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BootstrapRerouteService} from './bootstrap-reroute.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Game, GameCacheService} from 'jtb-core-games-ui';
import {TestBed} from '@angular/core/testing';

class MockGameCacheService {
    public observables: Map<string, Subject<Game>> = new Map<string, Subject<Game>>();

    public getGame(id: string): Observable<Game> {
        let s = new Subject<Game>();
        this.observables.set(id, s);
        return Observable.from(s);
    }
}

class MockRouter {
    events = new Subject<any>();
    navigateByUrl = jasmine.createSpy('nbu');
}

describe('Service: bootstrap reroute service', () => {
    let rerouteService: BootstrapRerouteService;
    let router: MockRouter;
    let gameCache: MockGameCacheService;

    beforeEach(() => {
        this.injector = TestBed.configureTestingModule({
            providers: [
                {provide: GameCacheService, useClass: MockGameCacheService},
                {provide: Router, useClass: MockRouter},
                BootstrapRerouteService
            ]
        });
        rerouteService = TestBed.get(BootstrapRerouteService);
        gameCache = TestBed.get(GameCacheService);
        router = TestBed.get(Router) as MockRouter;
    });

    describe('when enabled', () => {
        it('initially has no subscriptions and is active', () => {
            expect(gameCache.observables.size).toEqual(0);
            expect(rerouteService.enabled).toBeTruthy();
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('navigation end to non-game does nothing', () => {
            router.events.next(new NavigationEnd(null, '/x/y/z', null));
            expect(gameCache.observables.size).toEqual(0);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('navigation end has null url does not cause issue', () => {
            router.events.next(new NavigationEnd(null, null, null));
            expect(gameCache.observables.size).toEqual(0);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
            router.events.next(new NavigationEnd(null, undefined, null));
            expect(gameCache.observables.size).toEqual(0);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('subscribes to game when gets /game', () => {
            router.events.next(new NavigationEnd(null, '/game/y/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('does not subscribe when wrong event', () => {
            router.events.next(new NavigationStart(null, '/game/phase1/z123'));
            expect(gameCache.observables.size).toEqual(0);
        });

        it('does not reroute when phase matches', () => {
            router.events.next(new NavigationEnd(null, '/game/phase1/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));
            gameCache.observables.get('z123').next(new Game({id: 'z123', gamePhase: 'Phase1'}));
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('does reroute when phase changes', () => {
            router.events.next(new NavigationEnd(null, '/game/phase1/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));
            gameCache.observables.get('z123').next(new Game({id: 'z123', gamePhase: 'Phase2'}));
            expect(router.navigateByUrl).toHaveBeenCalledWith('/game/phase2/z123');
        });

        it('keeps listening when rerouted on same game', () => {
            router.events.next(new NavigationEnd(null, '/game/phase1/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));
            router.events.next(new NavigationEnd(null, '/game/phase2/z123', null));
            gameCache.observables.get('z123').next(new Game({id: 'z123', gamePhase: 'Phase3'}));
            expect(router.navigateByUrl).toHaveBeenCalledWith('/game/phase3/z123');
        });

        it('does nothing when id doesnt match', () => {
            router.events.next(new NavigationEnd(null, '/game/phase1/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));
            gameCache.observables.get('z123').next(new Game({id: 'z123x', gamePhase: 'Phase2'}));
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('does nothing when rerouted away from game', () => {
            router.events.next(new NavigationEnd(null, '/game/phase1/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));

            router.events.next(new NavigationEnd(null, '/create', null));
            gameCache.observables.get('z123').next(new Game({id: 'z123', gamePhase: 'Phase2'}));
            expect(router.navigateByUrl).not.toHaveBeenCalledWith();
        });

        it('switches games on new game', () => {
            router.events.next(new NavigationEnd(null, '/game/phase1/z123', null));
            expect(gameCache.observables.size).toEqual(1);
            expect(gameCache.observables.has('z123'));

            router.events.next(new NavigationEnd(null, '/game/phase1/a456', null));
            expect(gameCache.observables.size).toEqual(2);
            expect(gameCache.observables.has('a456'));

            gameCache.observables.get('z123').next(new Game({id: 'z123', gamePhase: 'Phase2'}));
            expect(router.navigateByUrl).not.toHaveBeenCalled();

            gameCache.observables.get('a456').next(new Game({id: 'a456', gamePhase: 'Phase3'}));
            expect(router.navigateByUrl).toHaveBeenCalledWith('/game/phase3/a456');
        });
    });

    describe('when disabled', () => {
        beforeEach(() => {
            rerouteService.enabled = false;
        });

        it('initially has no subscriptions', () => {
            expect(gameCache.observables.size).toEqual(0);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('does not subscribes to game when gets /game', () => {
            router.events.next(new NavigationEnd(null, '/game/y/z123', null));
            expect(gameCache.observables.size).toEqual(0);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

    });
});
