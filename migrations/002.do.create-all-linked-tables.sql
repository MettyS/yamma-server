BEGIN;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;

CREATE TABLE events (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	categories TEXT[] DEFAULT ARRAY[]::TEXT[],
	description TEXT,
	date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL
	-- NOTE: add article(s) URL(s) to later migrations 
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	email TEXT,
	date_created DATE DEFAULT NOW()
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	content text NOT NULL,
	date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
	user_id INTEGER REFERENCES users(id),
	event_id INTEGER REFERENCES events(id),
	archived BOOLEAN DEFAULT FALSE
);

COMMIT;
