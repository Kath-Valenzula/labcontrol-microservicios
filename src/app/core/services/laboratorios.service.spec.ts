import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LaboratoriosService } from './laboratorios.service';
import { ConfigService } from './config.service';

describe('LaboratoriosService', () => {
  let service: LaboratoriosService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LaboratoriosService,
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LaboratoriosService);
    httpMock = TestBed.inject(HttpTestingController);
    const cfg = TestBed.inject(ConfigService);
    baseUrl = `${cfg.getLaboratoriosBaseUrl()}/laboratorios`;
  });

  afterEach(() => httpMock.verify());

  it('getAll hace GET a /laboratorios', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('create hace POST y devuelve laboratorio', () => {
    const payload = { nombre: 'Lab' };
    service.create(payload).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, nombre: 'Lab' });
  });

  it('getById hace GET con id', () => {
    service.getById(9).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/9`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 9 });
  });

  it('delete hace DELETE', () => {
    service.delete(5).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
