import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandeTache } from '../../../noyau/modeles/planning.model';
import { TacheService } from '../../../noyau/services/tache.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-creer-taches-component',
  imports: [ReactiveFormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './creer-taches-component.html',
  styleUrls: ['./creer-taches-component.css']
})
export class CreerTachesComponent {

  @Input() idPlanning!: number;
  @Output() tacheCree = new EventEmitter<void>();
  @Output() fermerPopup = new EventEmitter<void>();

  formulaireTache: FormGroup;
  chargement = false;
  messageErreur = '';

  constructor(private fb: FormBuilder, private tacheService: TacheService) {
    this.formulaireTache = this.fb.group({
      titre: ['', Validators.required],
      duree_estimee: [1, [Validators.required, Validators.min(1)]],
      lien: [''],
      statut: ['a_faire']
    });
  }
  onSubmit() {
    // Créer la tâche via le service
    // Après succès :
    this.tacheCree.emit();
  }
  creerTache() {
    if (this.formulaireTache.invalid) return;

    this.chargement = true;
    const nouvelleTache: DemandeTache = this.formulaireTache.value;

    this.tacheService.creerTache(this.idPlanning, nouvelleTache)
      .subscribe({
        next: () => {
          this.chargement = false;
          this.tacheCree.emit();
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = 'Impossible de créer la tâche.';
        }
      });
  }

  fermer() {
    this.fermerPopup.emit();
  }
  
}
