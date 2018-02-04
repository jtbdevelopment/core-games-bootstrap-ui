import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {Subject} from 'rxjs/Subject';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VersionService} from './version.service';
import {DefaultVersionNotesComponent} from './default-version-notes.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AppConfig, Player, PlayerService} from 'jtb-core-games-ui';

class MockConfig implements AppConfig {
  releaseNotes: string = '';
  hoverMenu: boolean = false;
  appName: string = '';
  version: string = '1.3.1';
  inviteFriendsMessage: string = '';
}

@Component({
  selector: 'ngbd-modal-content',
  template: require('./default-version-notes.component.html')
})
export class MockReplacementComponent {
}

class MockPlayerService {
  public loggedInPlayer: Subject<Player> = new Subject<Player>();
}

class MockModalService {
  open = jasmine.createSpy('open');
}

describe('Service: version service', () => {
  let currentPlayer: Player = null;
  let loggedInPlayer: Player = null;
  let playerService: MockPlayerService;
  let modalService: MockModalService;
  let versionService: VersionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    currentPlayer = null;
    loggedInPlayer = null;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: 'AppConfig', useClass: MockConfig},
        {provide: PlayerService, useClass: MockPlayerService},
        {provide: NgbModal, useClass: MockModalService},
        VersionService
      ]
    });
    playerService = TestBed.get(PlayerService);
    modalService = TestBed.get(NgbModal);
    versionService = TestBed.get(VersionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('does not display when version matches', () => {
    let p = new Player();
    p.lastVersionNotes = '1.3.1';
    expect(modalService.open).not.toHaveBeenCalled();
    playerService.loggedInPlayer.next(p);
    expect(modalService.open).not.toHaveBeenCalled();
  });

  describe('expect to be updated', () => {
    afterEach(() => {
      expect(modalService.open).toHaveBeenCalledWith(DefaultVersionNotesComponent);
      let request = httpMock.expectOne('/api/player/lastVersionNotes/1.3.1');
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual('');
      request.flush('');
    });

    it('does display when version is minor patch', () => {
      let p = new Player();
      p.lastVersionNotes = '1.3.0';
      expect(modalService.open).not.toHaveBeenCalled();
      playerService.loggedInPlayer.next(p);
    });

    it('does display when version is minor patch from unpatched', () => {
      let p = new Player();
      p.lastVersionNotes = '1.3';
      expect(modalService.open).not.toHaveBeenCalled();
      playerService.loggedInPlayer.next(p);
    });

    it('does display when version is minor upgrade', () => {
      let p = new Player();
      p.lastVersionNotes = '1.2.1';
      expect(modalService.open).not.toHaveBeenCalled();
      playerService.loggedInPlayer.next(p);
    });

    it('does display when version is major upgrade', () => {
      let p = new Player();
      p.lastVersionNotes = '0.3.1';
      expect(modalService.open).not.toHaveBeenCalled();
      playerService.loggedInPlayer.next(p);
    });
  });

  describe('uses overridden component', () => {
    beforeEach(() => {
      versionService.setVersionNotesComponent(MockReplacementComponent);
    });

    afterEach(() => {
      expect(modalService.open).toHaveBeenCalledWith(MockReplacementComponent);
      let request = httpMock.expectOne('/api/player/lastVersionNotes/1.3.1');
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual('');
      request.flush('');
    });

    it('does display when version is minor patch', () => {
      let p = new Player();
      p.lastVersionNotes = '1.3.0';
      expect(modalService.open).not.toHaveBeenCalled();
      playerService.loggedInPlayer.next(p);
    });
  });
});
