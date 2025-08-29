import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Planning, DemandePlanning } from '../../../noyau/modeles/planning.model';
import { PlanningService } from '../../../noyau/services/planning.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-udpdate-planning-component',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './udpdate-planning-component.html',
  styleUrls: ['./udpdate-planning-component.css']
})
export class UdpdatePlanningComponent {
  @Input() planning: Planning | null = null;
  @Input() idPeriode!: number;
  @Output() fermer = new EventEmitter<void>();
  @Output() miseAJour = new EventEmitter<Planning>();

  formulaire: FormGroup;
  chargement = false;
  messageErreur = '';

  constructor(private fb: FormBuilder, private planningService: PlanningService) {
    this.formulaire = this.fb.group({
      jour: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.planning) {
      this.formulaire.patchValue({
        jour: this.planning.jour
      });
    }
  }

  onSubmit() {
    if (this.formulaire.invalid || !this.planning) return; // <-- ajout de la vérification
    this.chargement = true;
  
    this.planningService.mettreAJourPlanning(this.idPeriode, this.planning.id, this.formulaire.value)
      .subscribe({
        next: (planning) => {
          this.chargement = false;
          this.miseAJour.emit(planning); // envoie la version mise à jour au parent
          this.fermer.emit(); // ferme le popup
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = 'Impossible de mettre à jour le planning.';
        }
      });
  }
  

  annuler() {
    this.fermer.emit();
  }
}
