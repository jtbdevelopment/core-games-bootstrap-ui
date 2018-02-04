import {TestBed} from '@angular/core/testing';
import {DefaultVersionNotesComponent} from './default-version-notes.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfig} from 'jtb-core-games-ui';


let releaseNotes: string = 'We made some changes!';

class MockAppConfig implements AppConfig {
  appName: string = '';
  hoverMenu: boolean = false;
  releaseNotes: string = releaseNotes;
  version: string = '';
  inviteFriendsMessage: string = '';
}

class MockModal {
  dismiss = jasmine.createSpy('dismiss');
}

describe('Component:  default version notes component', () => {
  let fixture;
  let modal;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DefaultVersionNotesComponent,
      ],
      providers: [
        {provide: 'AppConfig', useClass: MockAppConfig},
        {provide: NgbActiveModal, useClass: MockModal}
      ],
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(DefaultVersionNotesComponent);
    modal = TestBed.get(NgbActiveModal);
    fixture.detectChanges();
  });

  it('displays release notes', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('close modal', () => {
    expect(modal.dismiss).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.close-button').click();
    expect(modal.dismiss).toHaveBeenCalled();
  });
});
