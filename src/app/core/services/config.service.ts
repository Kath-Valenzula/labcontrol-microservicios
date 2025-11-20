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
    const env = (window as any).__env;
    const val = env?.API_BASE_URL;
    // Si existe una URL configurada, usarla; si no, usar la URL por defecto
    if (val && typeof val === 'string' && !val.startsWith('__')) {
      return val;
    }
    return environment.apiBaseUrl;
  }
}
