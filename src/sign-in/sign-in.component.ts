import {Component, Inject} from '@angular/core';
import {FacebookInitializerService, FacebookLoginService} from 'jtb-core-games-ui';

@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.component.html',
})
export class SignInComponent {
    public message: string = '';
    public showManual: boolean = false;
    public showFacebook: boolean = false;

    constructor(private facebookLogin: FacebookLoginService,
                private facebookInit: FacebookInitializerService,
                //  TODO - change any to Window - see https://github.com/angular/angular/issues/15640
                @Inject('Window') private window: any) {
        this.showManual = true;
        this.showFacebook = false;
        this.facebookInit.fbReady.then(() => {
            this.showFacebook = true;
        });
        this.facebookLogin.canAutoLogin.subscribe((can: boolean) => {
            if (can) {
                this.autoLogin();
            }
        });
    }

    public fbLogin(): void {
        this.facebookLogin.initiateLogin();
    }

    private autoLogin(): void {
        this.showFacebook = false;
        this.showManual = false;
        this.message = 'Logging in via Facebook';
        this.window.location.href = '/auth/facebook';
    }
}
