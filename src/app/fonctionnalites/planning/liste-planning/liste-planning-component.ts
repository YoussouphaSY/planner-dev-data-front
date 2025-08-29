import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeriodePlanning, Planning } from '../../../noyau/modeles/planning.model';
import { PlanningService } from '../../../noyau/services/planning.service';
import { AuthentificationService } from '../../../noyau/services/authentification.service';
import { PeriodeService } from '../../../noyau/services/periode.service';
import { Utilisateur } from '../../../noyau/modeles/utilisateur.model';
import { CreerPlanningComponent } from "../creer-planning/creer-planning-component";
import { ReactiveFormsModule } from '@angular/forms';
import { UdpdatePlanningComponent } from "../udpdate-planning/udpdate-planning-component";

@Component({
  selector: 'app-liste-planning-component',
  imports: [NgIf, NgFor, RouterLink, DatePipe, CreerPlanningComponent, ReactiveFormsModule, UdpdatePlanningComponent],
  templateUrl: './liste-planning-component.html',
  styleUrls: ['./liste-planning-component.css']
})
export class ListePlanningComponent {
  
  idPeriode!: number;
  plannings: Planning[] = [];
  chargement = true;
  erreur = '';
  utilisateurActuel: Utilisateur | null = null;
  periode?: PeriodePlanning;

  afficherPopupModification = false;
  planningAModifier: Planning | null = null;


  constructor(
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private periodeService: PeriodeService,
    private router: Router,
    private authentificationService: AuthentificationService
  ) {}

  // ngOnInit(): void {
  //   // Récupérer l'id de la période depuis l'URL
  //   this.idPeriode = Number(this.route.snapshot.paramMap.get('id'));
  //   console.log('ID de la période:', this.idPeriode);

  //   this.chargerPlannings();
  // }


  ngOnInit(): void {
    this.authentificationService.utilisateurActuel$.subscribe(utilisateur => {
      this.utilisateurActuel = utilisateur;
      if (utilisateur) {
        this.idPeriode = Number(this.route.snapshot.paramMap.get('id'));
        console.log('ID de la période:', this.idPeriode);
  
        this.chargerPeriode();
        this.chargerPlannings();
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
  

  deconnexion(): void {
    this.authentificationService.deconnexion();
    this.router.navigate(['/connexion']);
  }

  chargerPlannings(): void {
    this.chargement = true;
    console.log('Chargement des plannings...');

    this.planningService.obtenirPlanningsParPeriode(this.idPeriode)
    .subscribe({
      next: (data: any) => {
        console.log('Plannings reçus du service:', data);
        this.plannings = data.results; // <-- récupérer uniquement le tableau
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des plannings:', err);
        this.erreur = 'Impossible de charger les plannings.';
        this.chargement = false;
      }
    });
  
  }

  ouvrirPopupModification(planning: Planning) {
    this.planningAModifier = planning;
    this.afficherPopupModification = true;
  }
  
  fermerPopupModification() {
    this.afficherPopupModification = false;
    this.planningAModifier = null;
  }
  
  mettreAJourPlanningDansListe(planningMiseAJour: Planning) {
    const index = this.plannings.findIndex(p => p.id === planningMiseAJour.id);
    if (index !== -1) {
      this.plannings[index] = planningMiseAJour;
    }
  }
  
  supprimerPlanning(idPlanning: number) {
    if (!confirm('Voulez-vous vraiment supprimer ce planning ?')) return;
    this.planningService.supprimerPlanning(this.idPeriode, idPlanning).subscribe({
      next: () => {
        this.plannings = this.plannings.filter(p => p.id !== idPlanning);
      },
      error: (err) => {
        console.error(err);
        alert('Impossible de supprimer le planning.');
      }
    });
  }

  // Optionnel : suivre les éléments par id pour *ngFor
  suivrePlanning(index: number, planning: Planning): number {
    return planning.id;
  }

  afficherPopup = false;

  rafraichirPlannings() {
    this.chargerPlannings();
  }

}
