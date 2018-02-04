import {TestBed} from '@angular/core/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DefaultActionConfirmComponent} from './default-action-confirm.component';


class MockModal {
  close = jasmine.createSpy('close');
  dismiss = jasmine.createSpy('dismiss');
}

describe('Component:  default action confirm component', () => {
  let fixture;
  let modal;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DefaultActionConfirmComponent,
      ],
      providers: [
        {provide: NgbActiveModal, useClass: MockModal}
      ],
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(DefaultActionConfirmComponent);
    modal = TestBed.get(NgbActiveModal);
    fixture.detectChanges();
  });

  it('displays confirm message', () => {
    fixture.componentInstance.confirmMessage = 'This will be very bad!';
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('cancel modal', () => {
    expect(modal.dismiss).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.cancel-button').click();
    expect(modal.dismiss).toHaveBeenCalled();
  });

  it('confirm modal', () => {
    expect(modal.close).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.action-button').click();
    expect(modal.close).toHaveBeenCalled();
  });
});
