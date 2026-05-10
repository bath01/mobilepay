-- MOBILE-PAY PostgreSQL Schema
-- Run this file to set up the database: psql -d mobilepay -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(200),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_signed_in TIMESTAMP DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id SERIAL PRIMARY KEY,
  session_token VARCHAR(128) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- FAQ entries table
CREATE TABLE IF NOT EXISTS faq_entries (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(64) NOT NULL DEFAULT 'Général',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published VARCHAR(3) NOT NULL DEFAULT 'yes' CHECK (is_published IN ('yes', 'no')),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Merchant requests table
CREATE TABLE IF NOT EXISTS merchant_requests (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_token ON chat_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_faq_entries_published ON faq_entries(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_merchant_requests_status ON merchant_requests(status, created_at DESC);

-- Auto-update updated_at via trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['users', 'chat_sessions', 'faq_entries', 'merchant_requests']
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_%I_updated_at ON %I;
      CREATE TRIGGER set_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END;
$$;

-- Seed initial FAQ data
INSERT INTO faq_entries (slug, question, answer, category, sort_order, is_published) VALUES
  ('faq-compte-creation', 'Comment puis-je créer un compte MOBILE-PAY ?', 'Créer un compte MOBILE-PAY est simple et rapide. Téléchargez l''application, entrez votre numéro de téléphone, vérifiez votre identité avec une pièce d''identité valide, et vous êtes prêt à commencer. Le processus prend moins de 5 minutes.', 'Compte', 1, 'yes'),
  ('faq-frais-transaction', 'Quels sont les frais de transaction ?', 'Les frais varient selon le type de transaction. Pour les transferts locaux, nous facturons 0,5% du montant. Pour les transferts internationaux, les frais sont de 1,5%. Les paiements via QR code sont gratuits pour les marchands.', 'Tarifs', 2, 'yes'),
  ('faq-securite', 'Est-ce que MOBILE-PAY est sécurisé ?', 'Oui, la sécurité est notre priorité absolue. Nous utilisons le chiffrement bancaire de niveau militaire (AES-256) pour protéger toutes vos données. Votre compte est également protégé par une authentification à deux facteurs (2FA) et un code PIN personnel.', 'Sécurité', 3, 'yes'),
  ('faq-limites', 'Quel est le montant maximum que je peux transférer ?', 'Le montant maximum dépend de votre niveau de vérification. Niveau 1 : 500 000 FCFA/jour. Niveau 2 : 2 000 000 FCFA/jour. Niveau 3 : 5 000 000 FCFA/jour.', 'Tarifs', 4, 'yes'),
  ('faq-qr-code', 'Comment puis-je utiliser le code QR pour payer ?', 'Scannez le code QR unique du marchand avec votre téléphone, entrez le montant, et confirmez le paiement. Le paiement est instantané et le marchand reçoit une confirmation immédiate. Aucun frais n''est facturé pour les paiements via QR code.', 'Paiements', 5, 'yes')
ON CONFLICT (slug) DO NOTHING;

COMMIT;
