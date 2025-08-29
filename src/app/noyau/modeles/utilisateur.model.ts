export interface Utilisateur {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  filiere: Filiere;
  created_at: string;
  updated_at: string;
}

export type Filiere = 'Data' | 'Dev-Web' | 'Ref-Dig' | 'Aws' | 'Hackeuuse';

export interface DemandeConnexion {
  email: string;
  password: string;
}

export interface DemandeInscription {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  filiere: Filiere;
  password: string;
  password_confirm: string;
}

export interface ReponseAuth {
  user: Utilisateur;
  access: string;
  refresh: string;
}