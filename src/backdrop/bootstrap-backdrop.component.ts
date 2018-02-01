import {Component} from '@angular/core';

//  Pretty much a copy of NgbNodalBackdrop - they dont export it so we cant use directly
@Component({
    selector: 'jtb-modal-backdrop',
    template: '',
    host: {
        'class': 'modal-backdrop fade show'
    }
})
export class JTBModalBackdrop {
}