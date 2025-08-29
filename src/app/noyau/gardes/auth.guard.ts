import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authentificationService: AuthentificationService, private router: Router) {}

  canActivate(): boolean {
    if (this.authentificationService.estAuthentifie()) {
      return true;
    } else {
      this.router.navigate(['/connexion']);
      return false;
    }
  }
}