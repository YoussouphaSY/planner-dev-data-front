import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthentificationService } from '../../noyau/services/authentification.service';
import { PeriodeService } from '../../noyau/services/periode.service';
import { Utilisateur } from '../../noyau/modeles/utilisateur.model';
import { PeriodePlanning } from '../../noyau/modeles/planning.model';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {
  utilisateurActuel: Utilisateur | null = null;
  periodes: PeriodePlanning[] = [];
  chargement = true;

  constructor(
    private authentificationService: AuthentificationService,
    private periodeService: PeriodeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authentificationService.utilisateurActuel$.subscribe(utilisateur => {
      this.utilisateurActuel = utilisateur;
      if (utilisateur) {
        this.chargerPeriodesUtilisateur();
      }
    });
  }

  chargerPeriodesUtilisateur(): void {
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

  deconnexion(): void {
    this.authentificationService.deconnexion();
    this.router.navigate(['/connexion']);
  }

  formaterDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  obtenirDifferenceJours(debut: string, fin: string): number {
    const dateDebut = new Date(debut);
    const dateFin = new Date(fin);
    const diffTemps = Math.abs(dateFin.getTime() - dateDebut.getTime());
    return Math.ceil(diffTemps / (1000 * 60 * 60 * 24)) + 1;
  }

}