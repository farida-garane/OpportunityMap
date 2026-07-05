-- ============================================
-- OpportuniMap - Database creation script (UUID version)
-- ============================================

-- 1. Create the database (run once)
-- CREATE DATABASE opportunimap;

-- Connect to the database before running the rest:
-- \c opportunimap

-- 2. Enable the extension needed to generate UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- TABLE 1: users
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    field VARCHAR(100),
    city VARCHAR(100),
    study_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 2: opportunities
-- ============================================
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,          -- 'internship', 'competition', 'training', 'event'
    description TEXT,
    field VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    deadline DATE,
    link VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 3: favorites
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, opportunity_id)
);

-- ============================================
-- TABLE 4: notifications
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);