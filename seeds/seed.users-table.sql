DELETE FROM users;
SELECT setval('users_id_seq', 1, false);
INSERT INTO users (username, password, email)
VALUES
-- password is "pass"
('admin', '$2a$10$fJqRS8IPTGcTaeJtro8CT.rwCljPjrRJwL4X1MtJYdAa6viyknS2K', 'admin@email.com');
