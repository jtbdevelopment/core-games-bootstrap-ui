import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {VersionService} from './version.service';
import {DefaultVersionNotesComponent} from './default-version-notes.component';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

export {VersionService} from './version.service';
export {DefaultVersionNotesComponent} from './default-version-notes.component';

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    JTBCoreGamesUI
  ],
  providers: [
    VersionService
  ],
  entryComponents: [
    DefaultVersionNotesComponent
  ],
  declarations: [
    DefaultVersionNotesComponent
  ]
})
export class JTBCoreGamesUIBSVersionNotesModule {
  // noinspection JSUnusedLocalSymbols
  constructor(private versionService: VersionService) {
  }
}

