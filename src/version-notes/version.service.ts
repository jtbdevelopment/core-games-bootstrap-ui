import {Inject, Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DefaultVersionNotesComponent} from './default-version-notes.component';
import {HttpClient} from '@angular/common/http';
import {AppConfig, PlayerService} from 'jtb-core-games-ui';

@Injectable()
export class VersionService {
  private modalComponent: any = DefaultVersionNotesComponent;

  constructor(@Inject('AppConfig') private config: AppConfig,
              private http: HttpClient,
              private playerService: PlayerService,
              private modalService: NgbModal) {
    this.playerService.loggedInPlayer.subscribe(p => {
      this.displayVersionNotes(p.lastVersionNotes);
    });
  }

  /**
   * Component should take in AppConfig and use version notes
   * @param modalComponent
   */
  public setVersionNotesComponent(modalComponent: any) {
    this.modalComponent = modalComponent;
  }

  private displayVersionNotes(lastVersionForPlayer: string): void {
    let display = this.playerNeedsToSeeNotes(lastVersionForPlayer);
    if (display) {
      this.modalService.open(this.modalComponent);
      this.http.post('/api/player/lastVersionNotes/' + this.config.version, '')
        .subscribe(function () {
          console.log('updated player version.');
        });
    }
  }

  private playerNeedsToSeeNotes(lastVersionForPlayer: string) {
    let display: boolean = false;
    if (lastVersionForPlayer !== undefined) {
      let currentParts: string[] = this.config.version.split('.');
      let playerParts: string[] = lastVersionForPlayer.split('.');
      if (currentParts.length !== playerParts.length) {
        display = true;
      }
      if (display === false) {
        currentParts.forEach((v, index) => {
          if (parseInt(v, 10) > parseInt(playerParts[index], 10)) {
            display = true;
          }
        });
      }
    }
    return display;
  }
}
