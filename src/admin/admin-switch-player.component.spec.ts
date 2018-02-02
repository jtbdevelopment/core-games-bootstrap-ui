import {ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {NgbModule, NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {AdminSwitchPlayerComponent} from './admin-switch-player.component';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpRequest} from '@angular/common/http';
import {Player, PlayerService} from 'jtb-core-games-ui';

class MockPlayerService {
    static playerSubject: BehaviorSubject<Player> = new BehaviorSubject(new Player());
    static loggedInSubject: BehaviorSubject<Player> = new BehaviorSubject(new Player());

    player: Observable<Player> = Observable.from<Player>(MockPlayerService.playerSubject);
    loggedInPlayer: Observable<Player> = Observable.from<Player>(MockPlayerService.loggedInSubject);

    simulateUser = jasmine.createSpy('su');
}

describe('admin switch player component', () => {
    let httpMock: HttpTestingController;

    let initialPlayer = new Player({id: 'loggedin'});
    let simUser = new Player({id: 'sim'});

    let fixture: ComponentFixture<AdminSwitchPlayerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule,
                FormsModule,
                HttpClientTestingModule
            ],
            declarations: [
                AdminSwitchPlayerComponent
            ],
            providers: [
                {provide: PlayerService, useClass: MockPlayerService},
                NgbPaginationConfig
            ],
        });
        TestBed.compileComponents();
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(AdminSwitchPlayerComponent);
        fixture.detectChanges();
        MockPlayerService.playerSubject.next(initialPlayer);
        MockPlayerService.loggedInSubject.next(initialPlayer);
    });

    it('should render results from http', () => {
        expect(fixture.componentInstance.revertEnabled).toBeFalsy();
        expect(fixture.componentInstance.revertText).toEqual('You are yourself.');
        expect(fixture.componentInstance.searchText).toEqual('');
        expect(fixture).toMatchSnapshot();
    });

    describe('it after initial page of users loaded', () => {
        let players = [
            new Player({id: 'id1', displayName: 'dn1'}),
            new Player({id: 'id2', displayName: 'dn2'}),
            new Player({id: 'id3', displayName: 'dn4'}),
            new Player({id: 'id4', displayName: 'dn4'}),
        ];
        beforeEach(() => {
            let request = httpMock.expectOne(
                (req: HttpRequest<any>) => req.url === '/api/player/admin/playersLike' &&
                    req.params.get('pageSize') === '20' &&
                    req.params.get('page') === '0' &&
                    req.params.get('like') === ''
            );
            request.flush({
                totalElements: 40,
                number: 0,
                content: players
            });
            fixture.detectChanges();
        });

        afterEach(() => {
            httpMock.verify();
        });

        it('does render of players', () => {
            expect(fixture.componentInstance.currentPage).toBeCloseTo(1);
            expect(fixture.componentInstance.totalPlayers).toBeCloseTo(40);
            expect(JSON.stringify(fixture.componentInstance.players)).toEqual(JSON.stringify(players));
            expect(fixture).toMatchSnapshot();
        });

        it('can change pages', fakeAsync(() => {
            let newPlayers = [
                new Player({id: 'id7', displayName: 'dn7'}),
                new Player({id: 'id8', displayName: 'dn8'}),
                new Player({id: 'id9', displayName: 'dn9'}),
                new Player({id: 'id0', displayName: 'dn0'}),
            ];

            fixture.componentInstance.currentPage = 2;
            fixture.detectChanges();
            tick();
            fixture.componentInstance.changePage();

            let request = httpMock.expectOne(
                (req: HttpRequest<any>) => req.url === '/api/player/admin/playersLike' &&
                    req.params.get('pageSize') === '20' &&
                    req.params.get('page') === '1' &&
                    req.params.get('like') === ''
            );
            request.flush({
                totalElements: 45,
                number: 1,
                content: newPlayers
            });
            fixture.detectChanges();
            expect(fixture.componentInstance.currentPage).toEqual(2);
            expect(fixture.componentInstance.totalPlayers).toBeCloseTo(45);
            expect(JSON.stringify(fixture.componentInstance.players)).toEqual(JSON.stringify(newPlayers));
            expect(fixture).toMatchSnapshot();
        }));

        it('can change search text', () => {
            let newPlayers = [
                new Player({id: 'id7', displayName: 'dn7'})
            ];

            fixture.componentInstance.searchText = 'dn7';
            fixture.detectChanges();
            fixture.componentInstance.refreshUsers();

            let request = httpMock.expectOne(
                (req: HttpRequest<any>) => req.url === '/api/player/admin/playersLike' &&
                    req.params.get('pageSize') === '20' &&
                    req.params.get('page') === '0' &&
                    req.params.get('like') === 'dn7'
            );
            request.flush({
                totalElements: 1,
                number: 0,
                content: newPlayers
            });
            fixture.detectChanges();
            expect(fixture.componentInstance.currentPage).toEqual(1);
            expect(fixture.componentInstance.totalPlayers).toBeCloseTo(1);
            expect(JSON.stringify(fixture.componentInstance.players)).toEqual(JSON.stringify(newPlayers));

            expect(fixture).toMatchSnapshot();
        });

        it('switching players', inject([PlayerService], (playerService) => {
            fixture.componentInstance.switchToPlayer(simUser.id);
            expect(playerService.simulateUser).toHaveBeenCalledWith(simUser.id);
            MockPlayerService.playerSubject.next(simUser);
            fixture.detectChanges();

            expect(fixture.componentInstance.revertEnabled).toBeTruthy();
            expect(fixture.componentInstance.revertText).toEqual('You are simulating another player.');
            expect(fixture).toMatchSnapshot();
        }));

        it('reverting', inject([PlayerService], (playerService) => {
            fixture.componentInstance.revertEnabled = true;
            fixture.componentInstance.revertText = '';
            fixture.componentInstance.revertToNormal();
            expect(playerService.simulateUser).toHaveBeenCalledWith(initialPlayer.id);
            MockPlayerService.playerSubject.next(initialPlayer);
            fixture.detectChanges();

            expect(fixture.componentInstance.revertEnabled).toBeFalsy();
            expect(fixture.componentInstance.revertText).toEqual('You are yourself.');
            expect(fixture).toMatchSnapshot();
        }));
    });

});
