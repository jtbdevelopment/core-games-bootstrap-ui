import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SignInComponent} from './sign-in.component';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

export {SignInComponent} from './sign-in.component';

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    JTBCoreGamesUI
  ],
  exports: [
    SignInComponent
  ],
  declarations: [
    SignInComponent
  ]
})
export class JTBCoreGamesUIBSSignInModule {
}

