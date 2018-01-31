import {TestBed} from '@angular/core/testing';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BootstrapErrorListenerService} from './bootstrap-error-listener.service';
import {DefaultErrorComponent} from './default-error.component';
import {MessageBusService} from 'jtb-core-games-ui';

class MockModalService {
    open = jasmine.createSpy('open');
}

describe('Service: error listener service', () => {
    let modalService: MockModalService;
    let errorService: BootstrapErrorListenerService;
    let messageBus: MessageBusService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: NgbModal, useClass: MockModalService},
                MessageBusService,
                BootstrapErrorListenerService
            ]
        });
        modalService = TestBed.get(NgbModal);
        errorService = TestBed.get(BootstrapErrorListenerService);
        messageBus = TestBed.get(MessageBusService);
    });


    describe('default listener shows error', () => {
        it('on invalid session', () => {
            messageBus.invalidSessionError.next('something bad');
            expect(modalService.open).toHaveBeenCalledWith(DefaultErrorComponent);
        });

        it('on general error', () => {
            messageBus.generalError.next('something bad');
            expect(modalService.open).toHaveBeenCalledWith(DefaultErrorComponent);
        });
    });

    describe('disabled listener does not show errors', () => {
        it('on invalid session', () => {
            errorService.listenToSessionErrors = false;
            messageBus.invalidSessionError.next('something bad');
            expect(modalService.open).not.toHaveBeenCalled();
        });

        it('on general error', () => {
            errorService.listenToGeneralErrors = false;
            messageBus.generalError.next('something bad');
            expect(modalService.open).not.toHaveBeenCalled();
        });
    });
});
