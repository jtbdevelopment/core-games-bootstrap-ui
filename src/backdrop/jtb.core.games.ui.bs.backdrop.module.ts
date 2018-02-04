import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BootstrapBackdropService} from './bootstrap-backdrop.service';
import {JTBModalBackdrop} from './bootstrap-backdrop.component';

export {BootstrapBackdropService} from './bootstrap-backdrop.service';
export {JTBModalBackdrop} from './bootstrap-backdrop.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    JTBModalBackdrop
  ],
  entryComponents: [
    JTBModalBackdrop
  ],
  providers: [
    BootstrapBackdropService
  ],
})
export class JTBCoreGamesUIBSBackdropModule {
}

