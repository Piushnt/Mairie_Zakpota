-- 1. Table des Tarifs des Services
CREATE TABLE services_tarifs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'etat-civil', 'urbanisme', etc.
  name TEXT NOT NULL,
  description TEXT,
  pieces TEXT[], -- Array de chaînes
  cost INTEGER,
  delay TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Actualités (News)
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des Rendez-vous
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_name TEXT NOT NULL,
  citizen_email TEXT,
  citizen_phone TEXT,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'en_attente', -- 'en_attente', 'valide', 'annule'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des Opportunités
CREATE TABLE opportunites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  type TEXT,
  date_limite DATE,
  statut TEXT DEFAULT 'ouvert',
  description TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table des Arrondissements
CREATE TABLE arrondissements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  ca TEXT,
  contact TEXT,
  localisation TEXT,
  quartiers TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table de l'Agenda / Stade
CREATE TABLE agenda_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT,
  description TEXT,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table des Rapports Officiels (Documents)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  year INTEGER,
  type TEXT, -- 'Conseil de Supervision', 'Rapport Annuel', etc.
  category TEXT, -- 'Sessions', 'Budgets', etc.
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table de Configuration (Flash News, Marché, Stade)
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value JSONB
);

-- Insertion Initiale de la config
INSERT INTO site_config (key, value) VALUES 
('flash_news', '"Bienvenue sur le portail officiel de la Mairie de Za-Kpota. Suivez toute l''actualité de votre commune en temps réel."'),
('market_config', '{"referenceDate": "2026-03-15", "cycleDays": 5}'),
('stade_config', '{"image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200", "equipements": ["Pelouse synthétique FIFA", "Éclairage nocturne", "Vestiaires modernes", "Tribune de 5 000 places", "Piste d''athlétisme"]}');
-- 9. Sécurité RLS (Row Level Security)
ALTER TABLE services_tarifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunites ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrondissements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Public Read Services" ON services_tarifs FOR SELECT USING (true);
CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Public Read Opportunites" ON opportunites FOR SELECT USING (true);
CREATE POLICY "Public Read Arrondissements" ON arrondissements FOR SELECT USING (true);
CREATE POLICY "Public Read Agenda" ON agenda_events FOR SELECT USING (true);
CREATE POLICY "Public Read Reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON site_config FOR SELECT USING (true);

-- Politiques d'écriture pour les administrateurs authentifiés
CREATE POLICY "Admin All Services" ON services_tarifs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All News" ON news FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Appointments" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Opportunites" ON opportunites FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Arrondissements" ON arrondissements FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Agenda" ON agenda_events FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Reports" ON reports FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Config" ON site_config FOR ALL TO authenticated USING (true);

