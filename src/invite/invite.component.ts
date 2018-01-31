import {Component, Inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfig, FacebookInviteService, FriendsService, Invitable} from 'jtb-core-games-ui';

@Component({
    selector: 'invite-friends',
    template: require('./invite.component.html'),
})
export class InviteComponent {
    public invitable: Invitable[] = [];
    public chosen: Invitable[] = [];

    constructor(private facebookInviteService: FacebookInviteService,
                private friendService: FriendsService,
                private modalRef: NgbActiveModal,
                @Inject('AppConfig') private config: AppConfig) {
        this.friendService.invitableFriends.subscribe(f => {
            this.invitable = f;
            this.chosen = [];
        });
    }

    public cancel(): void {
        this.modalRef.dismiss();
    }

    public inviteFriends(): void {
        this.facebookInviteService.inviteFriends(this.chosen, this.config.inviteFriendsMessage);
        this.modalRef.close();
    }
}
