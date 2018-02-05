import {Component} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Player, PlayerService} from 'jtb-core-games-ui';

@Component({
  selector: 'admin-switch-player',
  templateUrl: './admin-switch-player.component.html',
})
export class AdminSwitchPlayerComponent {
  public revertText = '';
  public revertEnabled = false;
  public searchText = '';
  public players: Player[] = [];

  public pageSize = 20;
  public totalPlayers = 0;
  public currentPage = 1;

  private player: Player;
  private loggedInPlayer: Player;

  constructor(private playerService: PlayerService, private http: HttpClient) {
    this.playerService.player.subscribe(p => {
      this.player = p;
      this.computeRevert();
    });
    this.playerService.loggedInPlayer.subscribe(p => {
      this.loggedInPlayer = p;
      this.computeRevert();
    });
    this.refreshUsers();
  }

  public switchToPlayer(id: string): void {
    this.playerService.simulateUser(id);
  }

  public revertToNormal(): void {
    this.playerService.simulateUser(this.loggedInPlayer.id);
  }

  public changePage(): void {
    this.refreshUsers();
  }

  public refreshUsers(): void {
    this.http.get(
      '/api/player/admin/playersLike',
      {
        params:
          new HttpParams().set('page', String(this.currentPage - 1)).set('like', this.searchText).set('pageSize', String(this.pageSize))
      }
    ).subscribe(json => {
        this.processUsers(json);
      }
    );
  }

  private processUsers(json: any): void {
//noinspection TypeScriptUnresolvedVariable
    this.totalPlayers = json.totalElements;
    // controller.numberOfPages = response.totalPages;
    const newPlayers = [];
    json.content.forEach(p => {
      newPlayers.push(new Player(p));
    });
    this.players = newPlayers;
    this.currentPage = json.number + 1;
  }

  private computeRevert(): void {
    this.revertEnabled = (this.player && this.loggedInPlayer && this.player.id !== this.loggedInPlayer.id);
    this.revertText = this.revertEnabled ?
      'You are simulating another player.' :
      'You are yourself.';
  }
}
