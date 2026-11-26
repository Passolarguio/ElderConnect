-- ElderConnect: executar uma vez no banco elderconnect, como postgres
-- ou como elderconnect_app. O papel deve existir previamente.
BEGIN;
SET LOCAL ROLE elderconnect_app;
CREATE TABLE public.users (
 id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
 name VARCHAR(150) NOT NULL,
 email VARCHAR(255) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role VARCHAR(20) NOT NULL CHECK (role IN ('USER','ORGANIZER')),
 age INTEGER CHECK (age BETWEEN 0 AND 130),
 city VARCHAR(100), state CHAR(2) DEFAULT 'SE', avatar_url TEXT,
 latitude DOUBLE PRECISION CHECK (latitude BETWEEN -90 AND 90),
 longitude DOUBLE PRECISION CHECK (longitude BETWEEN -180 AND 180),
 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_users_email_lower ON public.users(LOWER(email));
CREATE TABLE public.interests (id VARCHAR(64) PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE);
CREATE TABLE public.user_interests (
 user_id VARCHAR(64) NOT NULL, interest_id VARCHAR(64) NOT NULL,
 PRIMARY KEY(user_id, interest_id),
 FOREIGN KEY(user_id) REFERENCES public.users(id) ON DELETE CASCADE,
 FOREIGN KEY(interest_id) REFERENCES public.interests(id) ON DELETE CASCADE
);
CREATE TABLE public.categories (id VARCHAR(64) PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE);
CREATE TABLE public.events (
 id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
 organizer_id VARCHAR(64) NOT NULL, category_id VARCHAR(64) NOT NULL,
 title VARCHAR(200) NOT NULL, description TEXT NOT NULL,
 starts_at TIMESTAMPTZ NOT NULL, address VARCHAR(255) NOT NULL,
 neighborhood VARCHAR(100), city VARCHAR(100) NOT NULL, state CHAR(2) DEFAULT 'SE',
 latitude DOUBLE PRECISION CHECK (latitude BETWEEN -90 AND 90),
 longitude DOUBLE PRECISION CHECK (longitude BETWEEN -180 AND 180),
 capacity INTEGER NOT NULL CHECK (capacity > 0),
 price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
 image TEXT, status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
 FOREIGN KEY(organizer_id) REFERENCES public.users(id),
 FOREIGN KEY(category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.registrations (
 id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
 user_id VARCHAR(64) NOT NULL, event_id VARCHAR(64) NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(user_id,event_id),
 FOREIGN KEY(user_id) REFERENCES public.users(id),
 FOREIGN KEY(event_id) REFERENCES public.events(id)
);
CREATE TABLE public.favorites (
 user_id VARCHAR(64) NOT NULL, event_id VARCHAR(64) NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(user_id,event_id),
 FOREIGN KEY(user_id) REFERENCES public.users(id) ON DELETE CASCADE,
 FOREIGN KEY(event_id) REFERENCES public.events(id) ON DELETE CASCADE
);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_category ON public.events(category_id);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_starts_at ON public.events(starts_at);
CREATE INDEX idx_registrations_event ON public.registrations(event_id);
CREATE INDEX idx_favorites_event ON public.favorites(event_id);
CREATE INDEX idx_user_interests_interest ON public.user_interests(interest_id);
COMMIT;
