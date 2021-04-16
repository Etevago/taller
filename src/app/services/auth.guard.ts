import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private as: AuthService,private router:Router) {

  }
  canActivate(): Observable<boolean> {
    return this.as.isAuth().pipe(
      tap(estado=>{
        if (!estado){
          this.router.navigate(["login"])
        }
      }),
      take(1)
    )
  } 
  
  canLoad(): Observable<boolean> {
    return this.as.isAuth().pipe(
      tap(estado=>{
        if (!estado){
          this.router.navigate(["login"])
        }
      })
    )
  }

}
