import {TestBed} from '@angular/core/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DefaultActionErrorComponent} from './default-action-error.component';


class MockModal {
    dismiss = jasmine.createSpy('dismiss');
}

describe('Component:  default action error component', () => {
    let fixture;
    let modal;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                DefaultActionErrorComponent,
            ],
            providers: [
                {provide: NgbActiveModal, useClass: MockModal}
            ],
        });
        TestBed.compileComponents();
        fixture = TestBed.createComponent(DefaultActionErrorComponent);
        modal = TestBed.get(NgbActiveModal);
        fixture.detectChanges();
    });

    it('displays error message', () => {
        fixture.componentInstance.errorMessage = 'Something went wrong!';
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.error-message').textContent.trim()).toEqual('Something went wrong!');
    });

    it('cancel modal', () => {
        expect(modal.dismiss).not.toHaveBeenCalled();
        fixture.nativeElement.querySelector('.close-button').click();
        expect(modal.dismiss).toHaveBeenCalled();
    });
});
