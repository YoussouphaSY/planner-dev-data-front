import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandePlanning, JourSemaine } from '../../../noyau/modeles/planning.model';
import { PlanningService } from '../../../noyau/services/planning.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-creer-planning-component',
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './creer-planning-component.html',
  styleUrls: ['./creer-planning-component.css']
})
export class CreerPlanningComponent {
  @Input() idPeriode!: number;
  @Output() planningCree = new EventEmitter<void>();

  formulaire: FormGroup;
  chargement = false;
  messageErreur = '';
  joursSemaine: JourSemaine[] = ['lundi','mardi','mercredi','jeudi','vendredi'];

  constructor(
    private fb: FormBuilder,
    private planningService: PlanningService
  ) {
    this.formulaire = this.fb.group({
      jour: ['', Validators.required]
    });
  }

  fermer(): void {
    this.messageErreur = '';
    // Émettre un événement pour fermer le popup depuis le parent
    this.planningCree.emit();
  }

  onSubmit(): void {
    if (this.formulaire.valid) {
      this.chargement = true;
      const data: DemandePlanning = this.formulaire.value;
      this.planningService.creerPlanning(this.idPeriode, data).subscribe({
        next: () => {
          this.chargement = false;
          this.planningCree.emit(); // prévenir le parent pour rafraîchir la liste
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = 'Impossible, dèja crée pour ce jour';
          console.error(err);
        }
      });
    }
  }

  // idPeriode!: number; 
}
