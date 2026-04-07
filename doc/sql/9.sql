-- 1. Table des Artisans Locaux
create table if not exists artisans (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  metier text not null, -- Ex: Menuisier, Maçon, Couturier
  arrondissement text not null,
  telephone text,
  description text,
  photo_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table de Suivi des Dossiers
create table if not exists dossiers (
  id text primary key, -- ID Alphanumérique court ex: ZK-2024-X45
  user_name text not null,
  service_type text not null, -- Ex: Acte de Naissance, Permis
  statut text default 'En attente', -- En attente, En cours, Signature, Prêt
  commentaire text,
  last_update timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table des Sondages / Budget Participatif
create table if not exists sondages (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  description text,
  options jsonb not null, -- Ex: [{"label": "Route Allahé", "votes": 0}, ...]
  is_active boolean default true,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertion de dossiers de démo
insert into dossiers (id, user_name, service_type, statut, commentaire) 
values 
('ZK-9912', 'Jean Soglo', 'Acte de Naissance', 'En cours', 'Vérification des registres en cours'),
('ZK-4432', 'Marie Sossa', 'Permis de Construire', 'Signé', 'Dossier prêt à être retiré au secrétariat.');

