import {JTBModalBackdrop} from './bootstrap-backdrop.component';
import {NgModule} from '@angular/core';
import {BootstrapBackdropService} from './bootstrap-backdrop.service';
import {TestBed} from '@angular/core/testing';

@NgModule({
  declarations: [JTBModalBackdrop],
  entryComponents: [
    JTBModalBackdrop,
  ]
})
class TestModule {
}

describe('Service: bootstrap-backdrop', () => {
  let service: BootstrapBackdropService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        BootstrapBackdropService
      ]
    });
    service = TestBed.get(BootstrapBackdropService);
  });

  it('add/remove backdrop', () => {
    service.addBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(1);
    service.removeBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(0);
  });

  it('only adds 1 backdrop, removes after stack of adds removed', () => {
    service.addBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(1);
    service.addBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(1);
    service.addBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(1);
    service.removeBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(1);
    service.removeBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(1);
    service.removeBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(0);
    service.removeBackdrop();
    expect(document.querySelectorAll('jtb-modal-backdrop').length).toEqual(0);
  });
});
