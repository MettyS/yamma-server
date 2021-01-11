BEGIN;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;


CREATE TABLE events (
	id SERIAL PRIMARY KEY,
	title VARCHAR (1000) UNIQUE NOT NULL,
	categories TEXT NOT NULL,
	description VARCHAR (2000),
  event_img VARCHAR NOT NULL,
  source_name VARCHAR NOT NULL,
  source_url VARCHAR UNIQUE NOT NULL,
  source_img VARCHAR NOT NULL,
  date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  date_published TIMESTAMPTZ NOT NULL,
  archived BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR (16) UNIQUE NOT NULL CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3),
	password VARCHAR (255) NOT NULL CONSTRAINT password_length CHECK (CHAR_LENGTH(password) >= 5),
	email VARCHAR (255) UNIQUE NOT NULL,
  profile_img VARCHAR DEFAULT NULL,
	date_created TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  content VARCHAR (1000) NOT NULL,
  date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
	archived BOOLEAN DEFAULT FALSE NOT NULL
);

COMMIT;