import {fakeAsync, TestBed} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminStatsComponent} from './admin-stats.component';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpRequest} from '@angular/common/http';

describe('admin stats component', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule,
                HttpClientTestingModule
            ],
            declarations: [
                AdminStatsComponent
            ],
            providers: [
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
                Http
            ],
        });
        TestBed.compileComponents();
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should render results from http', fakeAsync(() => {
        let now: number = Math.floor((new Date()).getTime() / 1000);
        let approxTimes: number[] = [
            Math.floor((now - 86400) / 100),
            Math.floor((now - (86400 * 7)) / 100),
            Math.floor((now - (86400 * 30)) / 100)
        ];
        const fixture = TestBed.createComponent(AdminStatsComponent);
        fixture.detectChanges();

        let request = httpMock.expectOne((req: HttpRequest<any>) => req.url === '/api/player/admin/playerCount' &&
            req.responseType === 'text'
        );
        request.flush(1.2);

        request = httpMock.expectOne((req: HttpRequest<any>) => req.url === '/api/player/admin/gameCount' &&
            req.responseType === 'text'
        );
        request.flush(3.4);

        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/playersCreated/' + approxTimes[0]) &&
            req.responseType === 'text'
        );
        request.flush(2.3);
        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/playersCreated/' + approxTimes[1]) &&
            req.responseType === 'text'
        );
        request.flush(4.5);
        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/playersCreated/' + approxTimes[2]) &&
            req.responseType === 'text'
        );
        request.flush(5.6);

        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/gamesSince/' + approxTimes[0]) &&
            req.responseType === 'text'
        );
        request.flush(10.2);
        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/gamesSince/' + approxTimes[1]) &&
            req.responseType === 'text'
        );
        request.flush(10.3);
        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/gamesSince/' + approxTimes[2]) &&
            req.responseType === 'text'
        );
        request.flush(10.4);

        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/playersLoggedIn/' + approxTimes[0]) &&
            req.responseType === 'text'
        );
        request.flush(6.7);
        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/playersLoggedIn/' + approxTimes[1]) &&
            req.responseType === 'text'
        );
        request.flush(7.8);
        request = httpMock.expectOne((req: HttpRequest<any>) => req.url.startsWith('/api/player/admin/playersLoggedIn/' + approxTimes[2]) &&
            req.responseType === 'text'
        );
        request.flush(8.9);

        fixture.detectChanges();

        let content = fixture.nativeElement.querySelector('.admin-stats').textContent.trim();
        expect(content).toContain('1.2');
        expect(content).toContain('3.4');

        expect(content).toContain('2.3');
        expect(content).toContain('4.5');
        expect(content).toContain('5.6');

        expect(content).toContain('6.7');
        expect(content).toContain('7.8');
        expect(content).toContain('8.9');

        expect(content).toContain('10.2');
        expect(content).toContain('10.3');
        expect(content).toContain('10.4');
    }));
});
