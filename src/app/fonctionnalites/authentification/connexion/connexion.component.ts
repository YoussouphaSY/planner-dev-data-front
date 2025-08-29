import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../../../noyau/services/authentification.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  formulaireConnexion: FormGroup;
  chargement = false;
  messageErreur = '';

  constructor(
    private fb: FormBuilder,
    private authentificationService: AuthentificationService,
    private router: Router
  ) {
    this.formulaireConnexion = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formulaireConnexion.valid) {
      this.chargement = true;
      this.messageErreur = '';

      this.authentificationService.connexion(this.formulaireConnexion.value).subscribe({
        next: () => {
          this.router.navigate(['/tableau-de-bord']);
        },
        error: (error) => {
          this.messageErreur = 'Email ou mot de passe incorrect';
          this.chargement = false;
        }
      });
    }
  }
}