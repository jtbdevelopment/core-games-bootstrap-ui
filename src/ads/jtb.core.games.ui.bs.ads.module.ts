import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BootstrapAdsService} from './bootstrap-ads.service';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule
    ],
    providers: [
        BootstrapAdsService
    ],
})
export class JTBCoreGamesUIBSAdsModule {
}

