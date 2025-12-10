import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ResultadosService } from './resultados.service';
import { ConfigService } from './config.service';

describe('ResultadosService', () => {
  let service: ResultadosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResultadosService,
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ResultadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll hace GET a /resultados', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/resultados');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getById hace GET con id', () => {
    service.getById(4).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/resultados/4');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 4 });
  });

  it('getByPacienteId agrega query param', () => {
    service.getByPacienteId(10).subscribe();
    const req = httpMock.expectOne(r => r.url === 'http://localhost:8080/api/resultados');
    expect(req.request.params.get('pacienteId')).toBe('10');
    req.flush([]);
  });

  it('update hace PUT con id', () => {
    service.update(3, { resultado: 'ok' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/resultados/3');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 3, resultado: 'ok' });
  });

  it('delete hace DELETE con id', () => {
    service.delete(11).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/resultados/11');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
