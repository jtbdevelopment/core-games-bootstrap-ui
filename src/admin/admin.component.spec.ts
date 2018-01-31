import {TestBed} from '@angular/core/testing';
import {Component, Input} from '@angular/core';
import {AdminComponent} from './admin.component';
import {NgbModule, NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'admin-stats',
    template: '<div class="admin-stats">stats</div>'
})
export class MockAdminStatsComponent {
    @Input() playerLoaded: boolean;
}

@Component({
    selector: 'admin-switch-player',
    template: '<div class="admin-switch-player">switch</div>'
})
export class MockAdminSwitchPlayerComponent {
    @Input() playerLoaded: boolean;
}


describe('admin component', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule
            ],
            declarations: [
                AdminComponent,
                MockAdminStatsComponent,
                MockAdminSwitchPlayerComponent,
            ],
            providers: [
                NgbTabsetConfig
            ],
        });
        TestBed.compileComponents();
    });

    it('should render basics, switch hidden by tabs', () => {
        const fixture = TestBed.createComponent(AdminComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.admin-stats').textContent.trim()).toEqual('stats');
        expect(fixture.nativeElement.querySelector('.admin-switch-player')).toBeNull();
    });
});
