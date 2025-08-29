import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TacheService } from '../../../noyau/services/tache.service';
import { Tache, DemandeTache, Planning, PeriodePlanning } from '../../../noyau/modeles/planning.model';
import { AuthentificationService } from '../../../noyau/services/authentification.service';
import { Utilisateur } from '../../../noyau/modeles/utilisateur.model';
import { CreerTachesComponent } from "../creer-taches-component/creer-taches-component";
import { ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from '../../../noyau/services/planning.service';
import { PeriodeService } from '../../../noyau/services/periode.service';

@Component({
  selector: 'app-liste-taches-component',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterLink, CreerTachesComponent, ReactiveFormsModule],
  templateUrl: './liste-taches-component.html',
  styleUrls: ['./liste-taches-component.css']
})
export class ListeTachesComponent {
  planningActuel?: Planning;
  plannings: Planning[] = [];
  idPeriode!: number;
  periode?: PeriodePlanning;
  afficherPopup = false;
  idPlanning!: number;
  taches: Tache[] = [];
  chargement = true;
  erreur = '';
  utilisateurActuel: Utilisateur | null = null;

  constructor(
    private route: ActivatedRoute,
    private tacheService: TacheService,
    private planningService: PlanningService,
    private periodeService: PeriodeService,    
    private router: Router,
    private authentificationService: AuthentificationService
  ) {}


  ngOnInit(): void {
    this.authentificationService.utilisateurActuel$.subscribe(utilisateur => {
      this.utilisateurActuel = utilisateur;
      if (utilisateur) {
        this.idPlanning = Number(this.route.snapshot.paramMap.get('id'));
        console.log('ID du planning récupéré depuis l\'URL:', this.idPlanning);
        this.rafraichirTaches();
        this.chargerTaches();
        this.chargerPeriode();
        
      }
    });

    this.planningService.obtenirPlanningParId(this.idPlanning, this.idPeriode).subscribe({
      next: (planning) => {
        this.planningActuel = planning;
        console.log('Planning actuel:', this.planningActuel);
      },
      error: (err) => {
        console.error('Erreur récupération planning:', err);
      }
    });
    
  }

  chargerPeriode(): void {
    this.periodeService.obtenirPeriodeParId(this.idPeriode).subscribe({
      next: (data: PeriodePlanning) => {
        this.periode = data;
        console.log('Période récupérée:', this.periode);
      },
      error: (err) => {
        console.error('Erreur récupération période:', err);
      }
    });
  }
  chargerTaches(): void {
    this.chargement = true;
    console.log('Début du chargement des tâches pour le planning', this.idPlanning);
    this.tacheService.obtenirTachesParPlanning(this.idPlanning)
    .subscribe({
      next: (data: any) => {
        this.taches = data.results ? data.results : data; // <--- important
        this.chargement = false;
      },
      error: (err) => {
        this.erreur = 'Erreur lors du chargement des tâches.';
        this.chargement = false;
      }
    });
  
  }

  // Méthode pour récupérer les tâches
  rafraichirTaches() {
    if (!this.idPlanning) return;
    this.chargement = true;
    this.erreur = '';
  
    this.tacheService.obtenirTachesParPlanning(this.idPlanning)
      .subscribe({
        next: (data: any) => {
          this.taches = data.results ? data.results : data; // <-- ici
          this.chargement = false;
        },
        error: (err) => {
          this.erreur = 'Erreur lors du chargement des tâches.';
          this.chargement = false;
        }
      });
  }

  suivreTache(index: number, tache: Tache): number {
    return tache.id;
  }

  // --------------------------------------
  // Modifier une tâche (navigation vers formulaire)
  // --------------------------------------
  modifierTache(tache: Tache): void {
    console.log('Modifier la tâche:', tache);
    this.router.navigate(['/plannings', this.idPlanning, 'taches', tache.id, 'modifier']);
  }
  

  // --------------------------------------
  // Supprimer une tâche
  // --------------------------------------
  supprimerTache(tache: Tache): void {
    if (!confirm(`Voulez-vous vraiment supprimer la tâche "${tache.titre}" ?`)) {
      return;
    }
    console.log('Suppression de la tâche:', tache);
    this.tacheService.supprimerTache(this.idPlanning, tache.id).subscribe({
      next: () => {
        console.log('Tâche supprimée avec succès');
        // Supprimer la tâche de la liste locale pour mise à jour immédiate
        this.taches = this.taches.filter(t => t.id !== tache.id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression de la tâche.');
      }
    });
  }

  ouvrirPopup() {
    this.afficherPopup = true;
  }

  fermerPopup() {
    this.afficherPopup = false;
  }

  deconnexion(): void {
    this.authentificationService.deconnexion();
    this.router.navigate(['/connexion']);
  }

}
