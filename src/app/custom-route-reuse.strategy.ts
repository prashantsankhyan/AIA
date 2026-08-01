import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PreventNavigationGuard implements CanActivate {
  private lastRoute: string | null = null;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.lastRoute === state.url) {
      console.log(`Navigation prevented: Already on ${state.url}`);
      return false;
    }
    this.lastRoute = state.url;
    return true;
  }
}
