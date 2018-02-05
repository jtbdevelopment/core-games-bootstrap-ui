import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Game, GameCacheService} from 'jtb-core-games-ui';

//  Auto navigates on phase changes
@Injectable()
export class BootstrapRerouteService {
  public enabled: Boolean = true;

  private currentGameID = '';
  private currentLocation = '';
  private currentGameSubscription: Observable<Game>;

  constructor(private router: Router, private gameCache: GameCacheService) {
    router.events.subscribe((event) => {
      if (this.enabled && event instanceof NavigationEnd) {
        this.handleNavigation(event);
      }
    });
  }

  private handleNavigation(event: NavigationEnd): void {
    this.updateCurrentURLFromEvent(event);
    if (this.currentLocation.indexOf('/game') === 0) {
      const id = this.getGameIdFromURL();
      if (id !== this.currentGameID) {
        this.closeCurrentListen();
        this.startListeningForGameID(id);
      }
    } else {
      this.closeCurrentListen();
    }
  }

  private updateCurrentURLFromEvent(event: NavigationEnd): void {
    if (event.url !== undefined && event.url !== null) {
      this.currentLocation = event.url;
    } else {
      this.currentLocation = '';
    }
  }

  private getGameIdFromURL(): string {
    const parts = this.currentLocation.split('/');
    return parts[parts.length - 1];
  }

  private closeCurrentListen(): void {
    if (this.currentGameID !== '') {
      this.currentGameID = '';
      this.currentGameSubscription = undefined;
    }

  }

  private startListeningForGameID(id: string): void {
    this.currentGameID = id;
    this.currentGameSubscription = this.gameCache.getGame(id);
    this.currentGameSubscription.subscribe((game) => {
      if (game.id === this.currentGameID) {
        const expectedURL = game.standardLink();
        if (expectedURL !== this.currentLocation) {
          this.router.navigateByUrl(expectedURL);
        }
      }
    });
  }
}
