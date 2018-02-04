import {TestBed} from '@angular/core/testing';
import {JTBModalBackdrop} from './bootstrap-backdrop.component';


describe('Component:  bootstrap backdrop component', () => {
  let fixture;
  let modal;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JTBModalBackdrop,
      ],
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(JTBModalBackdrop);
    fixture.detectChanges();
  });

  it('displays backdrop', () => {
    expect(fixture).toMatchSnapshot();
  });
});
