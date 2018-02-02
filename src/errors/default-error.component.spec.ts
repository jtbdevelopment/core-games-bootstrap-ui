import {TestBed} from '@angular/core/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DefaultErrorComponent} from './default-error.component';
import {PlayerService} from 'jtb-core-games-ui';

class MockModal {
    dismiss = jasmine.createSpy('dismiss');
}

class MockPlayerService {
    forceLogout = jasmine.createSpy('forceLogout');
}

describe('Component:  default error component', () => {
    let fixture;
    let modal;
    let playerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                DefaultErrorComponent,
            ],
            providers: [
                {provide: NgbActiveModal, useClass: MockModal},
                {provide: PlayerService, useClass: MockPlayerService}
            ],
        });
        TestBed.compileComponents();
        fixture = TestBed.createComponent(DefaultErrorComponent);
        modal = TestBed.get(NgbActiveModal);
        playerService = TestBed.get(PlayerService) as MockPlayerService;
        fixture.detectChanges();
    });

    it('displays error', () => {
        expect(fixture).toMatchSnapshot();
    });


    it('close modal', () => {
        expect(modal.dismiss).not.toHaveBeenCalled();
        fixture.nativeElement.querySelector('.close-button').click();
        expect(modal.dismiss).toHaveBeenCalled();
        expect(playerService.forceLogout).toHaveBeenCalled();
    });
});
