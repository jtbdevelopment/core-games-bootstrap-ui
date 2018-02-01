import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BootstrapAdsService} from './bootstrap-ads.service';
import {FormsModule} from '@angular/forms';

export * from './bootstrap-ads.service';

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

