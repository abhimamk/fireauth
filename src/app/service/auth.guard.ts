import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthApiService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean | UrlTree {
    return this.authService.user.pipe(
      map((user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        this.router.navigate(['/']);
      }),
        // tap(isAuth => {
        //   if (!isAuth) {
        //     this.router.navigate(['/']);
        //   }
        // })
      ));
  }

}
