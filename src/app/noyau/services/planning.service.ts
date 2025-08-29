import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Planning, DemandePlanning } from '../modeles/planning.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private readonly API_URL = 'http://localhost:8000/api/plannings';

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
  // Plannings par période
  // ----------------------------
  obtenirPlanningsParPeriode(idPeriode: number): Observable<Planning[]> {
    return this.http.get<Planning[]>(
      `${this.API_URL}/periodes/${idPeriode}/plannings/`,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Planning par ID
  // ----------------------------
  obtenirPlanningParId(idPeriode: number, idPlanning: number): Observable<Planning> {
    return this.http.get<Planning>(
      `${this.API_URL}/periodes/${idPeriode}/plannings/${idPlanning}/`,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Créer un planning
  // ----------------------------
  creerPlanning(idPeriode: number, donneesPlanning: DemandePlanning): Observable<Planning> {
    return this.http.post<Planning>(
      `${this.API_URL}/periodes/${idPeriode}/plannings/`,
      donneesPlanning,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Mettre à jour un planning
  // ----------------------------
  mettreAJourPlanning(
    idPeriode: number,
    idPlanning: number,
    donneesPlanning: Partial<DemandePlanning>
  ): Observable<Planning> {
    return this.http.put<Planning>(
      `${this.API_URL}/periodes/${idPeriode}/plannings/${idPlanning}/`,
      donneesPlanning,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Supprimer un planning
  // ----------------------------
  supprimerPlanning(idPeriode: number, idPlanning: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/periodes/${idPeriode}/plannings/${idPlanning}/`,
      this.getHttpOptions()
    );
  }
}
