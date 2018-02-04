import {TestBed} from '@angular/core/testing';
import {SignedInComponent} from './signed-in.component';
import {Router} from '@angular/router';
import {PlayerService} from 'jtb-core-games-ui';


class MockPlayerService {
  loadLoggedInPlayer = jasmine.createSpy('llip');
}

class MockRouter {
  navigateByUrl = jasmine.createSpy('nbu');
}

describe('Component:  signed in component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignedInComponent,
      ],
      providers: [
        {provide: PlayerService, useClass: MockPlayerService},
        {provide: Router, useClass: MockRouter}
      ],
    });
    TestBed.compileComponents();
  });

  it('tells player service to load and navigates', () => {
    const fixture = TestBed.createComponent(SignedInComponent);
    let mockPlayerService = fixture.debugElement.injector.get(PlayerService);
    let router = fixture.debugElement.injector.get(Router);
    expect(mockPlayerService.loadLoggedInPlayer).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/main');
  });

  it('displays login successful', () => {
    const fixture = TestBed.createComponent(SignedInComponent);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
