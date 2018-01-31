import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InviteComponent} from './invite.component';
import {MultiSelectModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        MultiSelectModule,
        JTBCoreGamesUI
    ],
    providers: [
        {provide: 'Window', useValue: window}
    ],
    entryComponents: [
        InviteComponent
    ],
    declarations: [
        InviteComponent
    ]
})
export class JTBCoreGamesUIBInviteModule {
}

