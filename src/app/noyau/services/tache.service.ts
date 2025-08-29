import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache, DemandeTache } from '../modeles/planning.model';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
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
  // Tâches par planning
  // ----------------------------
  obtenirTachesParPlanning(idPlanning: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(
      `${this.API_URL}/plannings/${idPlanning}/tasks/`,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Tâche par ID
  // ----------------------------
  obtenirTacheParId(idPlanning: number, idTache: number): Observable<Tache> {
    return this.http.get<Tache>(
      `${this.API_URL}/plannings/${idPlanning}/tasks/${idTache}/`,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Créer une tâche
  // ----------------------------
  creerTache(idPlanning: number, donneesTache: DemandeTache): Observable<Tache> {
    return this.http.post<Tache>(
      `${this.API_URL}/plannings/${idPlanning}/tasks/`,
      donneesTache,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Mettre à jour une tâche
  // ----------------------------
  mettreAJourTache(
    idPlanning: number,
    idTache: number,
    donneesTache: Partial<DemandeTache>
  ): Observable<Tache> {
    return this.http.put<Tache>(
      `${this.API_URL}/plannings/${idPlanning}/tasks/${idTache}/`,
      donneesTache,
      this.getHttpOptions()
    );
  }

  // ----------------------------
  // Supprimer une tâche
  // ----------------------------
  supprimerTache(idPlanning: number, idTache: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/plannings/${idPlanning}/tasks/${idTache}/`,
      this.getHttpOptions()
    );
  }
}
