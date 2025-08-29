import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthentificationService } from '../../../noyau/services/authentification.service';
import { Filiere } from '../../../noyau/modeles/utilisateur.model';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgIf],
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordsCorrespondent }); // <-- Ajout du validateur
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordsCorrespondent(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirm')?.value;
    return password === confirm ? null : { passwordMismatch: true };
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