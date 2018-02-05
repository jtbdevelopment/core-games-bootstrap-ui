import {TestBed} from '@angular/core/testing';
import {JTBModalBackdropComponent} from './bootstrap-backdrop.component';


describe('Component:  bootstrap backdrop component', () => {
  let fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JTBModalBackdropComponent,
      ],
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(JTBModalBackdropComponent);
    fixture.detectChanges();
  });

  it('displays backdrop', () => {
    expect(fixture).toMatchSnapshot();
  });
});
