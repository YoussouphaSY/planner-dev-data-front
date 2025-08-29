import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandePlanning, JourSemaine } from '../../../noyau/modeles/planning.model';
import { PlanningService } from '../../../noyau/services/planning.service';
import { PeriodeService } from '../../../noyau/services/periode.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-creer-planning-component',
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './creer-planning-component.html',
  styleUrls: ['./creer-planning-component.css']
})
export class CreerPlanningComponent implements OnChanges {
  @Input() idPeriode!: number;
  @Output() planningCree = new EventEmitter<void>();

  formulaire: FormGroup;
  chargement = false;
  messageErreur = '';
  joursSemaine: JourSemaine[] = [];

  constructor(
    private fb: FormBuilder,
    private planningService: PlanningService,
    private periodeService: PeriodeService
  ) {
    this.formulaire = this.fb.group({
      jour: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPeriode'] && this.idPeriode) {
      this.chargerJoursDisponibles();
    }
  }

  // Récupérer les jours qui existent dans la période
  chargerJoursDisponibles(): void {
    this.periodeService.obtenirPeriodeParId(this.idPeriode).subscribe({
      next: periode => {
        const dateDebut = new Date(periode.date_debut);
        const dateFin = new Date(periode.date_fin);
        const jours: Set<JourSemaine> = new Set();

        // Parcours tous les jours de la période
        for (let d = new Date(dateDebut); d <= dateFin; d.setDate(d.getDate() + 1)) {
          const jour = d.getDay(); 
          switch(jour) {
            case 1: jours.add('lundi'); break;
            case 2: jours.add('mardi'); break;
            case 3: jours.add('mercredi'); break;
            case 4: jours.add('jeudi'); break;
            case 5: jours.add('vendredi'); break;
          }
        }

        this.joursSemaine = Array.from(jours) as JourSemaine[];
      },
      error: err => console.error('Erreur récupération période', err)
    });
  }

  fermer(): void {
    this.messageErreur = '';
    this.planningCree.emit();
  }

  onSubmit(): void {
    if (this.formulaire.valid) {
      this.chargement = true;
      const data: DemandePlanning = this.formulaire.value;
      this.planningService.creerPlanning(this.idPeriode, data).subscribe({
        next: () => {
          this.chargement = false;
          this.planningCree.emit();
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = 'Impossible, déjà créé pour ce jour';
          console.error(err);
        }
      });
    }
  }
}
