import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-content',
    template: require('./default-action-confirm.component.html')
})
export class DefaultActionConfirmComponent {
    @Input() public confirmMessage: String;

    constructor(public activeModal: NgbActiveModal) {
    }
}
