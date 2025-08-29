import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeriodeService } from '../../../noyau/services/periode.service';

@Component({
  selector: 'app-creer-periode',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './creer-periode.component.html',
  styleUrls: ['./creer-periode.component.css']
})
export class CreerPeriodeComponent {
  formulairePeriode: FormGroup;
  chargement = false;
  messageErreur = '';

  constructor(
    private fb: FormBuilder,
    private periodeService: PeriodeService,
    private router: Router
  ) {
    this.formulairePeriode = this.fb.group({
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required]
    }, { validators: this.validateurPlageDate });
  }

  validateurPlageDate(group: FormGroup) {
    const debut = group.get('date_debut')?.value;
    const fin = group.get('date_fin')?.value;
    
    if (debut && fin && new Date(debut) >= new Date(fin)) {
      return { plageDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.formulairePeriode.valid) {
      this.chargement = true;
      this.messageErreur = '';

      this.periodeService.creerPeriode(this.formulairePeriode.value).subscribe({
        next: (periode) => {
          this.router.navigate(['/periodes', periode.id]);
        },
        error: (error) => {
          this.messageErreur = 'Erreur lors de la création de la période';
          this.chargement = false;
        }
      });
    }
  }

  retourner(): void {
    this.router.navigate(['/tableau-de-bord']);
  }

  formaterDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  obtenirDureeEnJours(): number {
    const debut = this.formulairePeriode.get('date_debut')?.value;
    const fin = this.formulairePeriode.get('date_fin')?.value;
    
    if (debut && fin) {
      const dateDebut = new Date(debut);
      const dateFin = new Date(fin);
      const diffTemps = Math.abs(dateFin.getTime() - dateDebut.getTime());
      return Math.ceil(diffTemps / (1000 * 60 * 60 * 24)) + 1;
    }
    
    return 0;
  }
}