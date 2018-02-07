import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {InviteComponent} from './invite.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MultiSelectModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {AppConfig, FacebookInviteService, FriendsService, Invitable} from 'jtb-core-games-ui';
import {from} from 'rxjs/observable/from';

class MockFacebookInviteService {
  inviteFriends = jasmine.createSpy('inviteFriends');
}

class MockFriendService {
  public invitableFriendSubject: BehaviorSubject<Invitable[]> = new BehaviorSubject<Invitable[]>([]);
  public invitableFriends: Observable<Invitable[]> = from<Invitable[]>(this.invitableFriendSubject);
}

class MockConfig implements AppConfig {
  releaseNotes = '';
  hoverMenu = false;
  appName = '';
  version = '';
  inviteFriendsMessage = 'come play games!';
}

class MockModal {
  dismiss = jasmine.createSpy('dismiss');
  close = jasmine.createSpy('close');
}


describe('Component:  invite component', () => {
  let fbInvite: MockFacebookInviteService;
  let friendService: MockFriendService;
  let modalRef: MockModal;
  let fixture: ComponentFixture<InviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        FormsModule,
        MultiSelectModule
      ],
      providers: [
        {provide: FacebookInviteService, useClass: MockFacebookInviteService},
        {provide: FriendsService, useClass: MockFriendService},
        {provide: NgbActiveModal, useClass: MockModal},
        {provide: 'AppConfig', useClass: MockConfig}
      ],
      declarations: [
        InviteComponent
      ]
    });
    TestBed.compileComponents();
    modalRef = TestBed.get(NgbActiveModal);
    fixture = TestBed.createComponent(InviteComponent);
    fbInvite = TestBed.get(FacebookInviteService);
    friendService = TestBed.get(FriendsService);
  });

  //  Not testing prime faces multi-select

  it('subscribes to friends and updates clear chosen', () => {
    fixture.componentInstance.chosen = [new Invitable('d3', 'n3')];
    const friends = [new Invitable('d1', 'n1'), new Invitable('d2', 'n2')];
    friendService.invitableFriendSubject.next(friends);
    fixture.detectChanges();
    expect(fixture.componentInstance.chosen).toEqual([]);
    expect(fixture.componentInstance.invitable).toEqual(friends);
    expect(fixture).toMatchSnapshot();
  });

  it('cancel closes and does not invite', () => {
    fixture.nativeElement.querySelector('.cancel-invite').click();
    expect(modalRef.dismiss).toHaveBeenCalled();
    expect(fbInvite.inviteFriends).not.toHaveBeenCalled();
  });

  it('invite invites the chosen', () => {
    const friends = [new Invitable('d1', 'n1'), new Invitable('d2', 'n2'), new Invitable('x1', 'x3')];
    friendService.invitableFriendSubject.next(friends);
    fixture.componentInstance.chosen = friends;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
    fixture.nativeElement.querySelector('.invite-friends').click();
    expect(fbInvite.inviteFriends).toHaveBeenCalledWith(friends, 'come play games!');
    expect(modalRef.close).toHaveBeenCalled();
  });
});
