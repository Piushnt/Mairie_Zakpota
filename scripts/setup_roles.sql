-- Table des Rôles du Conseil (Hiérarchie)
CREATE TABLE IF NOT EXISTS council_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    importance_order INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insertion des rôles par défaut
INSERT INTO council_roles (title, importance_order) VALUES 
('Maire', 1),
('Secrétaire Exécutif', 2),
('Premier Adjoint au Maire', 3),
('Deuxième Adjoint au Maire', 4),
('Conseiller Municipal', 10)
ON CONFLICT (title) DO NOTHING;

-- Ajout de la clé étrangère dans la table council
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'council' AND column_name = 'role_id') THEN
        ALTER TABLE council ADD COLUMN role_id UUID REFERENCES council_roles(id);
    END IF;
END $$;

-- Migration des données existantes (tentative de correspondance par titre)
UPDATE council c
SET role_id = r.id
FROM council_roles r
WHERE c.role = r.title AND c.role_id IS NULL;

-- Politique RLS pour les rôles
ALTER TABLE council_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select for council_roles" ON council_roles;
CREATE POLICY "Allow public select for council_roles" ON council_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users on council_roles" ON council_roles;
CREATE POLICY "Allow all for authenticated users on council_roles" ON council_roles FOR ALL USING (auth.role() = 'authenticated');
