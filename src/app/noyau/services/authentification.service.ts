import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Utilisateur, DemandeConnexion, DemandeInscription, ReponseAuth } from '../modeles/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private readonly API_URL = 'https://planner-dev-data-backend.onrender.com/api/auth';
  private utilisateurActuelSubject = new BehaviorSubject<Utilisateur | null>(null);
  public utilisateurActuel$ = this.utilisateurActuelSubject.asObservable();

  constructor(private http: HttpClient) {
    this.chargerUtilisateurActuel();
  }

  private chargerUtilisateurActuel(): void {
    const token = localStorage.getItem('auth_token'); // clé corrigée
    if (token) {
      this.obtenirProfil().subscribe({
        next: (utilisateur) => this.utilisateurActuelSubject.next(utilisateur),
        error: () => this.deconnexion()
      });
    }
  }

  connexion(identifiants: DemandeConnexion): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.API_URL}/login/`, identifiants).pipe(
tap(reponse => {
  localStorage.setItem('auth_token', reponse.access);   // <--- corriger ici
  localStorage.setItem('refresh_token', reponse.refresh);
  this.utilisateurActuelSubject.next(reponse.user);     // si ton backend renvoie user
})

    );
  }

  inscription(donneesUtilisateur: DemandeInscription): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.API_URL}/register/`, donneesUtilisateur).pipe(
      tap(reponse => {
        localStorage.setItem('auth_token', reponse.access);
        localStorage.setItem('refresh_token', reponse.refresh);
        this.utilisateurActuelSubject.next(reponse.user);
      })
    );
  }

  obtenirProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.API_URL}/profile/`);
  }

  mettreAJourProfil(donneesUtilisateur: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.API_URL}/profile/update/`, donneesUtilisateur).pipe(
      tap(utilisateur => this.utilisateurActuelSubject.next(utilisateur))
    );
  }

  obtenirTousLesUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.API_URL}/users/`);
  }

  deconnexion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    this.utilisateurActuelSubject.next(null);
  }

  estAuthentifie(): boolean {
    console.log('Token stocké :', localStorage.getItem('auth_token'));
    return !!localStorage.getItem('auth_token'); // clé corrigée
  }

  obtenirToken(): string | null {
    return localStorage.getItem('auth_token'); // clé corrigée
  }
}
