import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BootstrapActionsService} from './bootstrap-actions.service';
import {Router} from '@angular/router';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {BootstrapAdsService} from '../ads/bootstrap-ads.service';
import {BootstrapBackdropService} from '../backdrop/bootstrap-backdrop.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DefaultActionErrorComponent} from './default-action-error.component';
import {DefaultActionConfirmComponent} from './default-action-confirm.component';
import {GameCacheService, GameFactory, MultiPlayerGame} from 'jtb-core-games-ui';

@Component({
  selector: 'ngbd-modal-content',
  template: '<p class="error">{{errorMessage}}</p><p class="confirm">{{confirmMessage}}</p>'
})
export class MockReplacementComponent {
  @Input() errorMessage: string = '';
  @Input() confirmMessage: string = '';
}

class MockGameCacheService {
  putGame = jasmine.createSpy('putGame');
}

class MockAdService {
  public resolve: (reason?: any) => void;
  public reject: (reason?: any) => void;
  public lastPromise: Promise<any>;

  public showAdPopup(): Promise<any> {
    this.lastPromise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });

    return this.lastPromise;
  }

}

class MockModalRef {
  public component: any;
  public componentInstance: any = {};
  public result: Promise<any>;

  private _resolve: (result?: any) => void;
  private _reject: (reason?: any) => void;

  constructor() {
    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }


  close(result?: any): void {
    this._resolve(result);
  }

  dismiss(reason?: any): void {
    this._reject(reason);
  }

}

class MockModalService {
  public lastStub: MockModalRef;

  public open(component: any): MockModalRef {
    this.lastStub = new MockModalRef();
    this.lastStub.component = component;
    return this.lastStub;
  }
}

class MockGameFactory implements GameFactory {
  static lastGame: MultiPlayerGame;

  public newGame(original?: Object): any {
    MockGameFactory.lastGame = new MultiPlayerGame(original);
    return MockGameFactory.lastGame;
  }
}

class MockRouter {
  navigateByUrl = jasmine.createSpy('nbu');
}

class MockBackdrop {
  addBackdrop = jasmine.createSpy('addbd');
  removeBackdrop = jasmine.createSpy('removebd');
}

describe('Service: bootstrap actions service', () => {
  let modalService: MockModalService;
  let actionService: BootstrapActionsService;
  let router: MockRouter;
  let gameCache: MockGameCacheService;
  let ads: MockAdService;
  let backdrop: MockBackdrop;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: NgbModal, useClass: MockModalService},
        {provide: 'GameFactory', useClass: MockGameFactory},
        {provide: GameCacheService, useClass: MockGameCacheService},
        {provide: Router, useClass: MockRouter},
        {provide: BootstrapAdsService, useClass: MockAdService},
        {provide: BootstrapBackdropService, useClass: MockBackdrop},
        BootstrapActionsService
      ]
    });
    modalService = TestBed.get(NgbModal);
    actionService = TestBed.get(BootstrapActionsService);
    gameCache = TestBed.get(GameCacheService);
    router = TestBed.get(Router);
    ads = TestBed.get(BootstrapAdsService) as MockAdService;
    backdrop = TestBed.get(BootstrapBackdropService) as MockBackdrop;
    httpMock = TestBed.get(HttpTestingController);
  });

  it('game url', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({id: 'myId'});
    expect(actionService.gameURL(game)).toEqual('/api/player/game/myId/');
  });

  it('game action with no body', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'noBody'});
    let put = actionService.gameAction(game, 'test');
    put.subscribe(() => {
      //
    });

    let request = httpMock.expectOne('/api/player/game/noBody/test');
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toBeNull();
  });

  it('game action with body', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'body'});
    let body = {flag: false, otherOption: 'value'};
    let put = actionService.gameAction(game, 'testBody', body);
    put.subscribe(() => {
      //
    });

    let request = httpMock.expectOne('/api/player/game/body/testBody');
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(body);
  });

  describe('simple accept actions with ads with success', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'successGame'});
    let action: string;

    afterEach(fakeAsync(() => {
      expect(ads.lastPromise).toBeDefined();
      ads.resolve();
      tick();

      let request = httpMock.expectOne('/api/player/game/successGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      let gameResponse = new MultiPlayerGame({id: 'successGame2', gamePhase: 'aPhase'});
      request.flush(gameResponse);
      expect(gameCache.putGame).toHaveBeenCalledWith(gameResponse);
      httpMock.verify();
    }));

    it('accepts game', () => {
      action = 'accept';
      expect(ads.lastPromise).toBeUndefined();
      actionService.accept(game);
    });
  });

  describe('rematch game with ads with success', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'successGame'});
    let action: string;

    afterEach(fakeAsync(() => {
      expect(ads.lastPromise).toBeDefined();
      ads.resolve();
      tick();

      let request = httpMock.expectOne('/api/player/game/successGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      let gameResponse = new MultiPlayerGame({id: 'successGame2', gamePhase: 'aPhase'});
      request.flush(gameResponse);

      expect(gameCache.putGame).toHaveBeenCalledWith(gameResponse);
      expect(router.navigateByUrl).toHaveBeenCalledWith(gameResponse.standardLink());
      httpMock.verify();
    }));

    it('rematch game', () => {
      action = 'rematch';
      expect(ads.lastPromise).toBeUndefined();
      actionService.rematch(game);
    });
  });

  describe('new game with ads with success', () => {
    let options: Object;

    afterEach(fakeAsync(() => {
      expect(ads.lastPromise).toBeDefined();
      ads.resolve();
      tick();

      let request = httpMock.expectOne('/api/player/new');
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual(options);

      let gameResponse = new MultiPlayerGame({id: 'newGame', gamePhase: 'newPhase'});
      request.flush(gameResponse);

      expect(gameCache.putGame).toHaveBeenCalledWith(gameResponse);
      expect(router.navigateByUrl).toHaveBeenCalledWith(gameResponse.standardLink());
    }));

    it('new game', () => {
      expect(ads.lastPromise).toBeUndefined();
      options = {a: 1, b: '32', c: ['something', 'somethin']};
      actionService.newGame(options);
    });
  });

  describe('simple accept actions with failure', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'failureGame'});
    let action: string;

    afterEach(fakeAsync(() => {
      expect(ads.lastPromise).toBeDefined();
      ads.resolve();
      tick();

      let request = httpMock.expectOne('/api/player/game/failureGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      request.flush('something is not right', {
        status: 402,
        statusText: 'x'
      });

      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(DefaultActionErrorComponent);
      expect(modalService.lastStub.componentInstance.errorMessage).toEqual('something is not right');
      expect(gameCache.putGame).not.toHaveBeenCalled();
    }));

    it('accepts game', () => {
      action = 'accept';
      actionService.accept(game);
    });
  });

  describe('rematch game with failure', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'failureGame'});
    let action: string;

    afterEach(fakeAsync(() => {
      expect(ads.lastPromise).toBeDefined();
      ads.resolve();
      tick();

      let request = httpMock.expectOne('/api/player/game/failureGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      request.flush('something is not right', {
        status: 402,
        statusText: 'something is not right'
      });

      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(DefaultActionErrorComponent);
      expect(modalService.lastStub.componentInstance.errorMessage).toEqual('something is not right');
      expect(gameCache.putGame).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      httpMock.verify();
    }));

    it('rematch game', () => {
      action = 'rematch';
      expect(ads.lastPromise).toBeUndefined();
      actionService.rematch(game);
    });
  });
  describe('simple accept with failure and custom error', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'failureGame'});
    let action: string;

    beforeEach(() => {
      actionService.setErrorComponent(MockReplacementComponent);
    });

    afterEach(fakeAsync(() => {
      expect(ads.lastPromise).toBeDefined();
      ads.resolve();
      tick();
      let request = httpMock.expectOne('/api/player/game/failureGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      request.flush('something is not right', {
        status: 402,
        statusText: 'something is not right'
      });

      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(MockReplacementComponent);
      expect(modalService.lastStub.componentInstance.errorMessage).toEqual('something is not right');
      expect(gameCache.putGame).not.toHaveBeenCalled();
      httpMock.verify();
    }));

    it('accepts game', () => {
      action = 'accept';
      actionService.accept(game);
    });
  });

  describe('confirming actions with success', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'successGame'});
    let action: string;
    let confirmMessage: string;

    afterEach(fakeAsync(() => {
      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(DefaultActionConfirmComponent);
      expect(modalService.lastStub.componentInstance.confirmMessage).toEqual(confirmMessage);

      modalService.lastStub.close();
      tick();

      let gameResponse = new MultiPlayerGame({id: 'successGame2', gamePhase: 'aPhase'});
      let request = httpMock.expectOne('/api/player/game/successGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      request.flush(gameResponse);

      expect(gameCache.putGame).toHaveBeenCalledWith(gameResponse);
      httpMock.verify();
    }));

    it('reject game', () => {
      action = 'reject';
      confirmMessage = 'Reject this game!';
      actionService.reject(game);
    });

    it('quit game', () => {
      action = 'quit';
      confirmMessage = 'Quit this game!';
      actionService.quit(game);
    });

    it('end series game', () => {
      action = 'endRematch';
      confirmMessage = 'End this series?';
      actionService.declineRematch(game);
    });
  });

  describe('confirming actions with error', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'failGame'});
    let action: string;
    let confirmMessage: string;

    afterEach(fakeAsync(() => {
      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(DefaultActionConfirmComponent);
      expect(modalService.lastStub.componentInstance.confirmMessage).toEqual(confirmMessage);

      modalService.lastStub.close();
      tick();

      let request = httpMock.expectOne('/api/player/game/failGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      request.flush('something is not right', {
        status: 402,
        statusText: 'something is not right'
      });

      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(DefaultActionErrorComponent);
      expect(modalService.lastStub.componentInstance.errorMessage).toEqual('something is not right');
      expect(gameCache.putGame).not.toHaveBeenCalled();
      httpMock.verify();
    }));

    it('reject game', () => {
      action = 'reject';
      confirmMessage = 'Reject this game!';
      actionService.reject(game);
    });

    it('quit game', () => {
      action = 'quit';
      confirmMessage = 'Quit this game!';
      actionService.quit(game);
    });

    it('end series game', () => {
      action = 'endRematch';
      confirmMessage = 'End this series?';
      actionService.declineRematch(game);
    });
  });

  describe('cancelling actions with success', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'successGame'});
    let action: string;
    let confirmMessage: string;

    afterEach(fakeAsync(() => {
      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(DefaultActionConfirmComponent);
      expect(modalService.lastStub.componentInstance.confirmMessage).toEqual(confirmMessage);

      modalService.lastStub.dismiss();
      tick();

      httpMock.verify();
      expect(gameCache.putGame).not.toHaveBeenCalled();
    }));

    it('reject game', () => {
      action = 'reject';
      confirmMessage = 'Reject this game!';
      actionService.reject(game);
    });

    it('quit game', () => {
      action = 'quit';
      confirmMessage = 'Quit this game!';
      actionService.quit(game);
    });

    it('end series game', () => {
      action = 'endRematch';
      confirmMessage = 'End this series?';
      actionService.declineRematch(game);
    });
  });

  describe('confirming actions with custom confirm', () => {
    let game: MultiPlayerGame = new MultiPlayerGame({'id': 'successGame'});
    let action: string;
    let confirmMessage: string;

    beforeEach(() => {
      actionService.setCofirmComponent(MockReplacementComponent);
    });

    afterEach(fakeAsync(() => {
      expect(modalService.lastStub).toBeDefined();
      expect(modalService.lastStub.component).toEqual(MockReplacementComponent);
      expect(modalService.lastStub.componentInstance.confirmMessage).toEqual(confirmMessage);

      modalService.lastStub.close();
      tick();

      let gameResponse = new MultiPlayerGame({id: 'successGame2', gamePhase: 'aPhase'});
      let request = httpMock.expectOne('/api/player/game/successGame/' + action);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toBeNull();

      request.flush(gameResponse);
      expect(gameCache.putGame).toHaveBeenCalledWith(gameResponse);
      httpMock.verify();
    }));

    it('reject game', () => {
      action = 'reject';
      confirmMessage = 'Reject this game!';
      actionService.reject(game);
    });
  });
});
