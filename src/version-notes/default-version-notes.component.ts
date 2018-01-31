import {Component, Inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfig} from 'jtb-core-games-ui';

@Component({
    selector: 'ngbd-modal-content',
    template: require('./default-version-notes.component.html')
})
export class DefaultVersionNotesComponent {
    constructor(public activeModal: NgbActiveModal, @Inject('AppConfig') public config: AppConfig) {
    }
}
