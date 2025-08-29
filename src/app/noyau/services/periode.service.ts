import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodePlanning, DemandePeriode } from '../modeles/planning.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodeService {
  private readonly API_URL = 'https://planner-dev-data-backend.onrender.com/api/plannings';

  constructor(private http: HttpClient) {}

  // Méthode utilitaire pour récupérer le token et créer les headers
  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    return { headers };
  }

  // ----------------------------
  // Toutes les périodes
  // ----------------------------
  obtenirToutesLesPeriodes(): Observable<PeriodePlanning[]> {
    return this.http.get<PeriodePlanning[]>(`${this.API_URL}/periodes/`, this.getHttpOptions());
  }

  // ----------------------------
  // Période par ID
  // ----------------------------
  obtenirPeriodeParId(id: number): Observable<PeriodePlanning> {
    return this.http.get<PeriodePlanning>(`${this.API_URL}/periodes/${id}/`, this.getHttpOptions());
  }

  // ----------------------------
  // Périodes d’un utilisateur
  // ----------------------------
  obtenirPeriodesUtilisateur(idUtilisateur: number): Observable<PeriodePlanning[]> {
    return this.http.get<PeriodePlanning[]>(
      `${this.API_URL}/periodes/user/${idUtilisateur}/`,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Créer une période
  // ----------------------------
  creerPeriode(donneesPeriode: DemandePeriode): Observable<PeriodePlanning> {
    return this.http.post<PeriodePlanning>(
      `${this.API_URL}/periodes/`,
      donneesPeriode,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Mettre à jour une période
  // ----------------------------
  mettreAJourPeriode(id: number, donneesPeriode: Partial<DemandePeriode>): Observable<PeriodePlanning> {
    return this.http.put<PeriodePlanning>(
      `${this.API_URL}/periodes/${id}/`,
      donneesPeriode,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Supprimer une période
  // ----------------------------
  supprimerPeriode(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/periodes/${id}/`, this.getHttpOptions());
  }
}
