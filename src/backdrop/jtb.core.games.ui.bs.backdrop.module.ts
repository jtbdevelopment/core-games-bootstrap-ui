import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BootstrapBackdropService} from './bootstrap-backdrop.service';
import {JTBModalBackdropComponent} from './bootstrap-backdrop.component';

export {BootstrapBackdropService} from './bootstrap-backdrop.service';
export {JTBModalBackdropComponent} from './bootstrap-backdrop.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    JTBModalBackdropComponent
  ],
  entryComponents: [
    JTBModalBackdropComponent
  ],
  providers: [
    BootstrapBackdropService
  ],
})
export class JTBCoreGamesUIBSBackdropModule {
}

