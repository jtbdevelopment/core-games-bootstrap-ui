import {Component, HostBinding} from '@angular/core';

//  Pretty much a copy of NgbNodalBackdrop - they dont export it so we cant use directly
@Component({
  selector: 'jtb-modal-backdrop',
  template: ''
})
export class JTBModalBackdropComponent {
  @HostBinding('class') backdropClass = 'modal-backdrop fade show';
}
