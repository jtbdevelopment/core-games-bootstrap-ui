import {
    ApplicationRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector
} from '@angular/core';
import {NgbModalBackdrop} from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';


//  Based of NgbModal code
//
//  TODO - figure out how to test - cant mock application ref
//
@Injectable()
export class BootstrapBackdropService {
    private _backdropFactory: ComponentFactory<NgbModalBackdrop>;
    private _backdropCount = 1;
    private _backdrop: ComponentRef<NgbModalBackdrop>;

    constructor(private _applicationRef: ApplicationRef,
                private _injector: Injector,
                private _componentFactoryResolver: ComponentFactoryResolver) {
        this._backdropFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalBackdrop);
    }

    public addBackdrop(): void {
        let containerEl = document.querySelector('body');
        this._backdropCount += 1;
        if (this._backdrop === undefined) {
            this._backdrop = this._backdropFactory.create(this._injector);
            this._applicationRef.attachView(this._backdrop.hostView);
            containerEl.appendChild(this._backdrop.location.nativeElement);
        }
    }

    public removeBackdrop(): void {
        this._backdropCount -= 1;
        if (this._backdropCount <= 1) {
            if (this._backdrop !== undefined) {
                let backdropNativeEl = this._backdrop.location.nativeElement;
                backdropNativeEl.parentNode.removeChild(backdropNativeEl);
                this._backdrop.destroy();
                this._backdrop = undefined;
                this._backdropCount = 0;
            }
        }

    }
}
