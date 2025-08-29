import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PeriodePlanning } from '../../../noyau/modeles/planning.model';
import { PeriodeService } from '../../../noyau/services/periode.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-udpdate-periode-component',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './udpdate-periode-component.html',
  styleUrls: ['./udpdate-periode-component.css']
})
export class UdpdatePeriodeComponent {


  @Output() miseAJour = new EventEmitter<PeriodePlanning>();
  @Input() periode!: PeriodePlanning;
  @Output() fermer = new EventEmitter<void>();

  formulaire: FormGroup;
  chargement = false;
  messageErreur = '';

  constructor(private fb: FormBuilder, private periodeService: PeriodeService) {
    this.formulaire = this.fb.group({
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required]
    });
  }

  ngOnInit() {
    if(this.periode){
      this.formulaire.patchValue({
        date_debut: this.periode.date_debut,
        date_fin: this.periode.date_fin
      });
    }
  }

  onSubmit() {
    if(this.formulaire.invalid) return;
    this.chargement = true;
  
    this.periodeService.mettreAJourPeriode(this.periode.id, this.formulaire.value)
      .subscribe({
        next: (periode) => {
          this.chargement = false;
          this.miseAJour.emit(periode); // 🔹 envoie la période mise à jour
          this.fermer.emit(); // ferme le popup
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = 'Impossible de mettre à jour la période.';
        }
      });
  }  


  annuler() {
    this.fermer.emit();
  }
}
