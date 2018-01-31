import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DefaultErrorComponent} from './default-error.component';
import {BootstrapErrorListenerService} from './bootstrap-error-listener.service';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        JTBCoreGamesUI
    ],
    providers: [
        BootstrapErrorListenerService
    ],
    entryComponents: [
        DefaultErrorComponent
    ],
    declarations: [
        DefaultErrorComponent
    ]
})
export class JTBCoreGamesUIBSErrorsModule {
    // noinspection JSUnusedLocalSymbols
    constructor(private errorListener: BootstrapErrorListenerService) {
    }
}
