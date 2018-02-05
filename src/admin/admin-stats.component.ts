import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'admin-stats',
  templateUrl: './admin-stats.component.html',
})
export class AdminStatsComponent {
  private static dayInSeconds = 86400;

  public playerCount = 0;
  public gameCount = 0;
  public gamesCreated: number[] = [0, 0, 0];
  public playersCreated: number[] = [0, 0, 0];
  public playerLogins: number[] = [0, 0, 0];

  private time: number = Math.floor((new Date()).getTime() / 1000);
  private times: number[] = [
    (this.time - AdminStatsComponent.dayInSeconds),
    (this.time - (AdminStatsComponent.dayInSeconds * 7)),
    (this.time - (AdminStatsComponent.dayInSeconds * 30))
  ];

  constructor(private http: HttpClient) {
    this.times.forEach((time, index) => {
      this.http.get('/api/player/admin/playersCreated/' + time, {responseType: 'text'})
        .subscribe(text => {
          this.playersCreated[index] = Number(text);
        });
      this.http.get('/api/player/admin/playersLoggedIn/' + time, {responseType: 'text'})
        .subscribe(text => {
          this.playerLogins[index] = Number(text);
        });
      this.http.get('/api/player/admin/gamesSince/' + time, {responseType: 'text'})
        .subscribe(text => {
          this.gamesCreated[index] = Number(text);
        });
    });
    this.http.get('/api/player/admin/gameCount', {responseType: 'text'})
      .subscribe(text => {
        this.gameCount = Number(text);
      });
    this.http.get('/api/player/admin/playerCount', {responseType: 'text'})
      .subscribe(text => {
        this.playerCount = Number(text);
      });
  }
}
