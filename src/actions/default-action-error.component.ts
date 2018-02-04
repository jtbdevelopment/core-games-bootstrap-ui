import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './default-action-error.component.html'
})
export class DefaultActionErrorComponent {
  @Input() public errorMessage: string;

  constructor(public activeModal: NgbActiveModal) {
  }
}
