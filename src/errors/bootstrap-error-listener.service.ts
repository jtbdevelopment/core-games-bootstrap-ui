import {Injectable} from '@angular/core';
import {DefaultErrorComponent} from './default-error.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageBusService} from 'jtb-core-games-ui';

@Injectable()
export class BootstrapErrorListenerService {
  public listenToSessionErrors: boolean = true;
  public listenToGeneralErrors: boolean = true;

  constructor(private messageBus: MessageBusService, private modalService: NgbModal) {
    this.messageBus.invalidSessionError.subscribe(() => {
      if (this.listenToSessionErrors) {
        modalService.open(DefaultErrorComponent);
      }
    });
    this.messageBus.generalError.subscribe(() => {
      if (this.listenToGeneralErrors) {
        modalService.open(DefaultErrorComponent);
      }
    });
  }

}
