import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminComponent} from './admin.component';
import {AdminStatsComponent} from './admin-stats.component';
import {AdminSwitchPlayerComponent} from './admin-switch-player.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

export * from './admin.component';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        JTBCoreGamesUI
    ],
    exports: [
        AdminComponent
    ],
    declarations: [
        AdminComponent,
        AdminStatsComponent,
        AdminSwitchPlayerComponent
    ]
})
export class JTBCoreGamesUIBSAdminModule {
}


