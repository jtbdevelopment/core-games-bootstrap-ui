import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {BootstrapActionsService} from './bootstrap-actions.service';
import {DefaultActionConfirmComponent} from './default-action-confirm.component';
import {DefaultActionErrorComponent} from './default-action-error.component';
import {JTBCoreGamesUIBSAdsModule} from '../ads/jtb.core.games.ui.bs.ads.module';
import {BootstrapRerouteService} from './bootstrap-reroute.service';
import {HttpClientModule} from '@angular/common/http';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

@NgModule({
    imports: [
        HttpClientModule,
        BrowserModule,
        NgbModule,
        FormsModule,
        JTBCoreGamesUI,
        JTBCoreGamesUIBSAdsModule
    ],
    providers: [
        BootstrapActionsService,
        BootstrapRerouteService
    ],
    entryComponents: [
        DefaultActionConfirmComponent,
        DefaultActionErrorComponent
    ],
    declarations: [
        DefaultActionConfirmComponent,
        DefaultActionErrorComponent
    ]
})
export class JTBCoreGamesUIBSActionsModule {
    constructor(private reroute: BootstrapRerouteService) {

    }
}
