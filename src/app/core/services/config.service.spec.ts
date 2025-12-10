import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = TestBed.inject(ConfigService);
    (window as any).__env = undefined;
  });

  afterEach(() => {
    (window as any).__env = undefined;
  });

  it('usa API_BASE_URL de window.__env cuando es valida', () => {
    (window as any).__env = { API_BASE_URL: 'https://api.custom.local' };
    expect(service.getApiBaseUrl()).toBe('https://api.custom.local');
  });

  it('omite API_BASE_URL invalida y usa environment.apiBaseUrl', () => {
    (window as any).__env = { API_BASE_URL: '__PLACEHOLDER__' };
    expect(service.getApiBaseUrl()).toBe('http://localhost:8080/api');
  });

  it('usa environment.apiBaseUrl cuando no hay __env', () => {
    expect(service.getApiBaseUrl()).toBe('http://localhost:8080/api');
  });
});
