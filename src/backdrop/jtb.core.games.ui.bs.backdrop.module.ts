import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BootstrapBackdropService} from './bootstrap-backdrop.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule
    ],
    providers: [
        BootstrapBackdropService
    ],
})
export class JTBCoreGamesUIBSBackdropModule {
}

