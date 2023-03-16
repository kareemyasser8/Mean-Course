import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthGaurd implements CanActivate{

  constructor(private authService: AuthService, private router: Router){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :boolean | Observable<boolean> | Promise<boolean>{
    const isAuth = this.authService.getIsAuth()
    if(!isAuth){
      this.router.navigate(['/login'])
    }
    return isAuth;
  }
}
