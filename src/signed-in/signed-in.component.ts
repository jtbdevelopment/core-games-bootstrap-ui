import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {PlayerService} from 'jtb-core-games-ui';

@Component({
    selector: 'signed-in',
    template: require('./signed-in.component.html'),
})
export class SignedInComponent {
    constructor(private playerService: PlayerService, private router: Router) {
        this.playerService.loadLoggedInPlayer();
        //noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl('/main');
    }
}
