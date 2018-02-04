import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SignedInComponent} from './signed-in.component';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

export {SignedInComponent} from './signed-in.component';

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    JTBCoreGamesUI
  ],
  exports: [
    SignedInComponent
  ],
  declarations: [
    SignedInComponent
  ]
})
export class JTBCoreGamesUIBSSignedInModule {
}

