BEGIN;

DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  username VARCHAR (16) NOT NULL CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3),
  content VARCHAR (1000) NOT NULL,
  date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
	archived BOOLEAN DEFAULT FALSE NOT NULL
);

COMMIT;