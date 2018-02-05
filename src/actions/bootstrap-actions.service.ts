import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {DefaultActionErrorComponent} from './default-action-error.component';
import {DefaultActionConfirmComponent} from './default-action-confirm.component';
import {Router} from '@angular/router';
import {BootstrapAdsService} from '../ads/bootstrap-ads.service';
import {BootstrapBackdropService} from '../backdrop/bootstrap-backdrop.service';
import {HttpClient} from '@angular/common/http';
import {Game, GameCacheService, GameFactory} from 'jtb-core-games-ui';

@Injectable()
export class BootstrapActionsService {

  private errorModal: any;

  private confirmModal: any;

  constructor(private http: HttpClient,
              private router: Router,
              @Inject('GameFactory') private gameFactory: GameFactory,
              private modalService: NgbModal,
              private ads: BootstrapAdsService,
              private backdrop: BootstrapBackdropService,
              private gameCache: GameCacheService) {
    this.errorModal = DefaultActionErrorComponent;
    this.confirmModal = DefaultActionConfirmComponent;
  }

  /**
   * Modal must take error message public confirmMessage string in inner model
   * @param modal
   */
  public setCofirmComponent(modal: any) {
    this.confirmModal = modal;
  }

  /**
   * Modal must take error message public errorMessage string in inner model
   * @param modal
   */
  public setErrorComponent(modal: any) {
    this.errorModal = modal;
  }

  public takeAction(httpObservable: Observable<Object>): Observable<Game> {
    const observable: Subject<Game> = new Subject<Game>();
    this.backdrop.addBackdrop();
    httpObservable
      .subscribe(json => {
        const game = this.gameFactory.newGame(json);
        this.gameCache.putGame(game);
        observable.next(game);
        this.backdrop.removeBackdrop();
      }, error => {
        console.log(JSON.stringify(error));
        const ngbModalRef = this.modalService.open(this.errorModal);
        ngbModalRef.componentInstance.errorMessage = error.error;
        observable.complete();
        this.backdrop.removeBackdrop();
      });
    return observable;
  }

  public takeActionWithConfirm(message: string, httpObservable: Observable<Object>): Observable<Game> {
    const observable: Subject<Game> = new Subject<Game>();
    const ngbModalRef = this.modalService.open(this.confirmModal);
    ngbModalRef.componentInstance.confirmMessage = message;
    ngbModalRef.result.then(() => {
      this.takeAction(httpObservable).subscribe((game: Game) => {
        observable.next(game);
      }, () => {
        observable.complete();
      });
    }, () => {
      observable.complete();
    });
    return observable;
  }

  public newGame(options: any): void {
    this.ads.showAdPopup().then(() => {
      this.takeAction(this.http.post('/api/player/new', options)).subscribe((game: Game) => {
        this.router.navigateByUrl(game.standardLink());
      });
    });
  }

  public accept(game: Game): void {
    this.ads.showAdPopup().then(() => {
      this.takeAction(this.gameAction(game, 'accept'));
    });
  }

  public reject(game: Game): void {
    this.takeActionWithConfirm('Reject this game!', this.gameAction(game, 'reject'));
  }

  public quit(game: Game): void {
    this.takeActionWithConfirm('Quit this game!', this.gameAction(game, 'quit'));
  }

  public rematch(game: Game): void {
    this.ads.showAdPopup().then(() => {
      this.takeAction(this.gameAction(game, 'rematch')).subscribe((newGame: Game) => {
        this.router.navigateByUrl(newGame.standardLink());
      });
    });
  }

  public declineRematch(game: Game): void {
    this.takeActionWithConfirm('End this series\?', this.gameAction(game, 'endRematch'));
  }

  public gameAction(game: Game, action: string, body?: any): Observable<Object> {
    return this.http.put(this.gameURL(game) + action, body);
  }

  public gameURL(game: Game): string {
    return '/api/player/game/' + game.id + '/';
  }
}
