import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const allowedRoles: string[] = route.data['roles'] || [];
    const user = this.auth.currentUserValue;
    if (!user) {
      return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }
    if (allowedRoles.length === 0) return true;
    if (allowedRoles.includes(user.rol)) return true;
    // no autorizado -> redirigir a dashboard
    return this.router.createUrlTree(['/dashboard']);
  }
}
