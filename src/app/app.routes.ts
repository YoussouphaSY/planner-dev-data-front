import { Routes } from '@angular/router';
import { AuthGuard } from './noyau/gardes/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/tableau-de-bord', pathMatch: 'full' },
  {
    path: 'connexion',
    loadComponent: () => import('./fonctionnalites/authentification/connexion/connexion.component').then(m => m.ConnexionComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./fonctionnalites/authentification/inscription/inscription.component').then(m => m.InscriptionComponent)
  },
  {
    path: 'tableau-de-bord',
    loadComponent: () => import('./fonctionnalites/tableau-de-bord/tableau-de-bord.component').then(m => m.TableauDeBordComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'periodes',
    loadComponent: () => import('./fonctionnalites/periodes/liste-periodes/liste-periodes.component').then(m => m.ListePeriodesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'periodes/creer',
    loadComponent: () => import('./fonctionnalites/periodes/creer-periode/creer-periode.component').then(m => m.CreerPeriodeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'periodes/:id',
    loadComponent: () => import('./fonctionnalites/planning/liste-planning/liste-planning-component').then(m => m.ListePlanningComponent),
    canActivate: [AuthGuard]
  },

  // {
  //   path: 'plannings/:id/taches',
  //   loadComponent: () => import('./fonctionnalites/taches/liste-taches-component/liste-taches-component').then(m => m.ListeTachesComponent)
  // },

  {
    path: 'plannings/:id/taches',
    loadComponent: () => import('./fonctionnalites/taches/liste-taches-component/liste-taches-component').then(m => m.ListeTachesComponent),
    canActivate: [AuthGuard]  // facultatif mais recommandé
  },

  // {
  //   path: 'plannings/:idPlanning/taches/:idTache/modifier',
  //   loadComponent: () => import('./fonctionnalites/taches/udpdate-tache/udpdate-tache-component').then(m => m.UdpdateTacheComponent),
  //   canActivate: [AuthGuard] // facultatif mais conseillé
  // },
  
  {
    path: 'plannings/:id/taches/:idTache/modifier',
    loadComponent: () => import('./fonctionnalites/taches/udpdate-tache/udpdate-tache-component').then(c => c.UdpdateTacheComponent),
    canActivate: [AuthGuard]
  },


  { path: '**', redirectTo: '/tableau-de-bord' }
];