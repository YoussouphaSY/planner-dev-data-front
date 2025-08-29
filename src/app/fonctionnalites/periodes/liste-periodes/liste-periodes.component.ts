import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodeService } from '../../../noyau/services/periode.service';
import { AuthentificationService } from '../../../noyau/services/authentification.service';
import { PeriodePlanning } from '../../../noyau/modeles/planning.model';
import { Utilisateur } from '../../../noyau/modeles/utilisateur.model';
import { UdpdatePeriodeComponent } from "../udpdate-periode/udpdate-periode-component";

@Component({
  selector: 'app-liste-periodes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UdpdatePeriodeComponent],
  templateUrl: './liste-periodes.component.html',
  styleUrls: ['./liste-periodes.component.css']
})
export class ListePeriodesComponent implements OnInit {
  afficherPopupModification = false;
  periodeAModifier!: PeriodePlanning;
  periodes: PeriodePlanning[] = [];
  chargement = true;
  utilisateurActuel: Utilisateur | null = null;

  // Filtre par état
  etatSelectionne: string = 'tous';

  constructor(
    private periodeService: PeriodeService,
    private router: Router,
    private authentificationService: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.authentificationService.utilisateurActuel$.subscribe(utilisateur => {
      this.utilisateurActuel = utilisateur;
      if (utilisateur) {
        this.chargerPeriodes();
      }
    });
  }

  // Filtrer les périodes selon l'état
  get periodesFiltrees() {
    if (this.etatSelectionne === 'tous') return this.periodes;
    return this.periodes.filter(p => p.statut === this.etatSelectionne);
  }

  chargerPeriodes(): void {
    if (this.utilisateurActuel?.id) {
      this.periodeService.obtenirPeriodesUtilisateur(this.utilisateurActuel.id).subscribe({
        next: (periodes) => {
          this.periodes = periodes;
          this.chargement = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des périodes:', error);
          this.chargement = false;
        }
      });
    }
  }

  supprimerPeriode(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) {
      this.periodeService.supprimerPeriode(id).subscribe({
        next: () => {
          this.periodes = this.periodes.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  ouvrirPopupModification(periode: PeriodePlanning) {
    this.periodeAModifier = periode;
    this.afficherPopupModification = true;
  }
  
  fermerPopupModification() {
    this.afficherPopupModification = false;
  }

  mettreAJourPeriodeDansListe(periodeMiseAJour: PeriodePlanning) {
    const index = this.periodes.findIndex(p => p.id === periodeMiseAJour.id);
    if (index !== -1) {
      this.periodes[index] = periodeMiseAJour;
    }
  }
  
  formaterDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  obtenirDureeEnJours(debut: string, fin: string): number {
    const dateDebut = new Date(debut);
    const dateFin = new Date(fin);
    const diffTemps = Math.abs(dateFin.getTime() - dateDebut.getTime());
    return Math.ceil(diffTemps / (1000 * 60 * 60 * 24)) + 1;
  }

  suivrePeriode(index: number, periode: PeriodePlanning): number {
    return periode.id;
  }

  deconnexion(): void {
    this.authentificationService.deconnexion();
    this.router.navigate(['/connexion']);
  }
}
