import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tache, DemandeTache, StatutTache } from '../../../noyau/modeles/planning.model';
import { TacheService } from '../../../noyau/services/tache.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-udpdate-tache-component',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './udpdate-tache-component.html',
  styleUrls: ['./udpdate-tache-component.css']
})
export class UdpdateTacheComponent {
  @Input() tache: Tache | null = null;
  @Input() idPlanning!: number;
  @Output() fermer = new EventEmitter<void>();
  @Output() miseAJour = new EventEmitter<Tache>();

  formulaire: FormGroup;
  chargement = false;
  messageErreur = '';

  statuts: StatutTache[] = ['a_faire', 'en_cours', 'termine'];

  constructor(private fb: FormBuilder, private tacheService: TacheService,  private TacheService: TacheService, private route: ActivatedRoute, private router: Router) {
    this.formulaire = this.fb.group({
      titre: ['', Validators.required],
      duree_estimee: ['', [Validators.required, Validators.min(1)]],
      lien: [''],
      statut: ['', Validators.required]
    });
  }
  ngOnInit() {
    const idPlanning = Number(this.route.snapshot.paramMap.get('id')); // param de route: 'id'
    const idTache = Number(this.route.snapshot.paramMap.get('idTache')); // param de route: 'idTache'
  
    console.log('ID Planning depuis URL:', idPlanning);
    console.log('ID Tâche depuis URL:', idTache);
  
    if (!isNaN(idPlanning) && !isNaN(idTache)) {
      this.idPlanning = idPlanning; // mets à jour l'input interne
      this.tacheService.obtenirTacheParId(this.idPlanning, idTache).subscribe(tache => {
        this.tache = tache;
        console.log('Tâche récupérée du service: ', tache);
        this.formulaire.patchValue({
          titre: tache.titre,
          duree_estimee: tache.duree_estimee,
          lien: tache.lien || '',
          statut: tache.statut
        });
      });
    }
  }
  
  onSubmit() {
    if (this.formulaire.invalid || !this.tache) {
      console.warn('Formulaire invalide ou tâche manquante', this.formulaire.value, this.tache);
      return;
    }
  
    this.chargement = true;
    console.log('Soumission du formulaire avec les données:', this.formulaire.value);
  
    this.tacheService.mettreAJourTache(this.idPlanning, this.tache.id, this.formulaire.value)
      .subscribe({
        next: (tacheMiseAJour) => {
          console.log('Tâche mise à jour avec succès:', tacheMiseAJour);
          this.chargement = false;
  
          // rediriger vers la liste des tâches
          this.router.navigate(['/plannings', this.idPlanning, 'taches']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la tâche:', err);
          this.chargement = false;
          this.messageErreur = 'Impossible de mettre à jour la tâche.';
        }
      });
  }
  

  annuler() {
    // redirige vers la liste des tâches du planning
    this.router.navigate(['/plannings', this.idPlanning, 'taches']);
  }
}
