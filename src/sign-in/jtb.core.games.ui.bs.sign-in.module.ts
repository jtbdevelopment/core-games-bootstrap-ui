import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SignInComponent} from './sign-in.component';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        JTBCoreGamesUI
    ],
    providers: [
        {provide: 'Window', useValue: window}
    ],
    exports: [
        SignInComponent
    ],
    declarations: [
        SignInComponent
    ]
})
export class JTBCoreGamesUIBSSignInModule {
}

