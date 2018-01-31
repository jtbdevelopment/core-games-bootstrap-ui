import {BootstrapBackdropService} from './bootstrap-backdrop.service';
import {TestBed} from '@angular/core/testing';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

describe('Service: bootstrap-backdrop', () => {
    let service: BootstrapBackdropService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModalModule
            ],
            providers: [
                BootstrapBackdropService
            ]
        });
        service = TestBed.get(BootstrapBackdropService);
    });

    it('add/remove backdrop', () => {
        service.addBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(1);
        service.removeBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(0);
    });

    it('only adds 1 backdrop, removes after stack of adds removed', () => {
        service.addBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(1);
        service.addBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(1);
        service.addBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(1);
        service.removeBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(1);
        service.removeBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(1);
        service.removeBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(0);
        service.removeBackdrop();
        expect(document.querySelectorAll('ngb-modal-backdrop').length).toEqual(0);
    });
});
