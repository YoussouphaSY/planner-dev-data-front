import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../../../noyau/services/authentification.service';
import { Filiere } from '../../../noyau/modeles/utilisateur.model';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  formulaireInscription: FormGroup;
  chargement = false;
  messageErreur = '';

  filieres = [
    { value: 'Data', label: 'DATA' },
    { value: 'Dev-Web', label: 'Dev-Web' },
    { value: 'Ref-Dig', label: 'Ref-Dig' },
    { value: 'Aws', label: 'AWS' },
    { value: 'Hackeuuse', label: 'Hackeuse' }
  ];

  constructor(
    private fb: FormBuilder,
    private authentificationService: AuthentificationService,
    private router: Router
  ) {
    this.formulaireInscription = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      filiere: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.formulaireInscription.valid) {
      this.chargement = true;
      this.messageErreur = '';

      this.authentificationService.inscription(this.formulaireInscription.value).subscribe({
        next: () => {
          this.router.navigate(['/tableau-de-bord']);
        },
        error: (error) => {
          this.messageErreur = 'Erreur lors de l\'inscription';
          this.chargement = false;
        }
      });
    }
  }
}