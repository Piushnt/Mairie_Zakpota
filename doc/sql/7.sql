-- Table pour les Audiences (Messages + RDV)
CREATE TABLE IF NOT EXISTS audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    type TEXT NOT NULL CHECK (type IN ('contact', 'rdv')),
    status TEXT DEFAULT 'En attente',
    appointment_date DATE,
    appointment_time TIME,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour le Conseil Municipal
CREATE TABLE IF NOT EXISTS council (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Politiques RLS (Sécurité)
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE council ENABLE ROW LEVEL SECURITY;

-- Autoriser l'insertion publique pour les audiences (formulaire citoyen)
DROP POLICY IF EXISTS "Allow public insert for audiences" ON audiences;
CREATE POLICY "Allow public insert for audiences" ON audiences FOR INSERT WITH CHECK (true);

-- Autoriser la lecture publique pour le conseil
DROP POLICY IF EXISTS "Allow public select for council" ON council;
CREATE POLICY "Allow public select for council" ON council FOR SELECT USING (true);

-- Autoriser tout pour les admins (authentifiés)
DROP POLICY IF EXISTS "Allow all for authenticated users on audiences" ON audiences;
CREATE POLICY "Allow all for authenticated users on audiences" ON audiences FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users on council" ON council;
CREATE POLICY "Allow all for authenticated users on council" ON council FOR ALL USING (auth.role() = 'authenticated');
