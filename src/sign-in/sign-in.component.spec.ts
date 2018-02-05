import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SignInComponent} from './sign-in.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FacebookInitializerService, FacebookLoginService} from 'jtb-core-games-ui';


class MockFacebookLogin {
  public canAutoLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  initiateLogin = jasmine.createSpy('initLogin');
}

class MockFacebookInit {
  public resolve: (result?: boolean) => void;
  public reject: (reason?: any) => void;
  public fbReady: Promise<any> = new Promise<any>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

declare let window: any;

describe('Component:  sign in component', () => {
  let fbLogin: MockFacebookLogin;
  let fbInit: MockFacebookInit;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: FacebookLoginService, useClass: MockFacebookLogin},
        {provide: FacebookInitializerService, useClass: MockFacebookInit}
      ],
      declarations: [
        SignInComponent,
      ]
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(SignInComponent);
    fbLogin = TestBed.get(FacebookLoginService);
    fbInit = TestBed.get(FacebookInitializerService);
    window.location.assign = jest.fn();
  });

  describe('non manual fb logins', () => {
    afterEach(() => {
      expect(fbLogin.initiateLogin).not.toHaveBeenCalled();
    });

    it('initially displays manual only', () => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('displays facebook after init', fakeAsync(() => {
      fbInit.resolve(true);
      tick();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    }));

    it('initiates auto login if possible', () => {
      fbLogin.canAutoLogin.next(true);
      expect(window.location.assign.mock.calls.length).toEqual(1);
      expect(window.location.assign.mock.calls[0].length).toEqual(1);
      expect(window.location.assign.mock.calls[0][0]).toEqual('/auth/facebook');
    });

    it('Does not initiate auto login if not possible', () => {
      fbLogin.canAutoLogin.next(false);
      expect(window.location.assign.mock.calls.length).toEqual(0);
      expect(fixture).toMatchSnapshot();
    });

    it('displays message', () => {
      fixture.componentInstance.message = 'A Message!';
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });

  it('clicking fb initiates manual fb login', fakeAsync(() => {
    fbInit.resolve(true);
    tick();
    fixture.detectChanges();
    const screen = fixture.nativeElement;
    expect(fixture).toMatchSnapshot();
    let fbButton = screen.querySelector('#fb-login');
    fbButton.click();
    expect(fbLogin.initiateLogin).toHaveBeenCalled();
  }));
});
