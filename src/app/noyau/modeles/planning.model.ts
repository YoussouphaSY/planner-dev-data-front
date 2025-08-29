export interface PeriodePlanning {
  id: number;
  user: number;
  date_debut: string;
  date_fin: string;

  // 🔥 ajoutés pour correspondre à l’API Django
  est_expire: boolean;
  statut: StatutPeriode;
}

export type StatutPeriode = 'actif' | 'termine' | 'retard';

export interface Planning {
  id: number;
  period: number;
  jour: JourSemaine;
}

export type JourSemaine = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';

export interface Tache {
  id: number;
  planning: number;
  titre: string;
  duree_estimee: number;
  lien?: string;
  statut: StatutTache;
}

export type StatutTache = 'a_faire' | 'en_cours' | 'termine';

export interface DemandePeriode {
  date_debut: string;
  date_fin: string;
}

export interface DemandePlanning {
  jour: JourSemaine;
}

export interface DemandeTache {
  titre: string;
  duree_estimee: number;
  lien?: string;
  statut?: StatutTache;
}
