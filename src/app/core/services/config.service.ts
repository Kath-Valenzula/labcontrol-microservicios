import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    __env?: { API_BASE_URL?: string };
  }
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getApiBaseUrl(): string {
    return this.fromWindow('API_BASE_URL') || environment.apiBaseUrl;
  }

  getUsuariosBaseUrl(): string {
    return this.fromWindow('API_USUARIOS') || (environment as any).apiUsuarios || this.getApiBaseUrl();
  }

  getLaboratoriosBaseUrl(): string {
    return this.fromWindow('API_LABORATORIOS') || (environment as any).apiLaboratorios || this.getApiBaseUrl();
  }

  getResultadosBaseUrl(): string {
    return this.fromWindow('API_RESULTADOS') || (environment as any).apiResultados || this.getApiBaseUrl();
  }

  private fromWindow(key: string): string | null {
    const env = (window as any).__env;
    const val = env?.[key];
    if (val && typeof val === 'string' && !val.startsWith('__')) {
      return val;
    }
    return null;
  }
}
