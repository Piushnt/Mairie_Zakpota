-- ===============================================
-- MISE À JOUR SÉCURITÉ : VÉRIFICATION DU CODE PIN
-- ===============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  requested_role TEXT;
  provided_pin TEXT;
  final_role TEXT := 'employee';
  final_approved BOOLEAN := false;
BEGIN
  -- Extraire les métadonnées envoyées lors de l'inscription
  requested_role := new.raw_user_meta_data->>'role';
  provided_pin := new.raw_user_meta_data->>'admin_pin';

  -- Vérification stricte et souveraine côté serveur
  IF requested_role = 'admin' AND provided_pin = 'AD22510537' THEN
    final_role := 'admin';
    final_approved := true; -- Validation automatique si le code est bon
  END IF;

  -- Insertion du profil final (toute triche rétrogradera silencieusement en employé)
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, is_approved)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    final_role, 
    final_approved
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
