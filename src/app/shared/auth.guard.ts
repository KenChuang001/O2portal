import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    console.log('AuthGuard!!');
    return true;
    // if (window.sessionStorage.getItem('logon') === 'Y') {
    //     return true;
    // }
    // this.router.navigate(['/logon']);
    // return false;
  }
}
