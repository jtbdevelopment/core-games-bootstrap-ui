import {Component} from '@angular/core';
import {FacebookInitializerService, FacebookLoginService} from 'jtb-core-games-ui';

declare let window: any;

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  public message = '';
  public showManual = false;
  public showFacebook = false;

  constructor(private facebookLogin: FacebookLoginService,
              private facebookInit: FacebookInitializerService) {
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
    window.location.assign('/auth/facebook');
  }
}
