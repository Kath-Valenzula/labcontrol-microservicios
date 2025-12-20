import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UsuariosService } from './usuarios.service';
import { ConfigService } from './config.service';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuariosService,
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsuariosService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = `${TestBed.inject(ConfigService).getUsuariosBaseUrl()}/usuarios`;
  });

  afterEach(() => httpMock.verify());

  it('getAll hace GET a /usuarios', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getById hace GET con id', () => {
    service.getById(7).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/7`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7 });
  });

  it('create hace POST en /usuarios', () => {
    service.create({ nombre: 'Ana' }).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });

  it('update hace PUT con id', () => {
    service.update(3, { nombre: 'Ana' }).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/3`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 3 });
  });

  it('delete hace DELETE con id', () => {
    service.delete(11).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/11`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
