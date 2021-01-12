TRUNCATE TABLE users CASCADE;
INSERT INTO users (username, password, email)
VALUES
-- password is "pass"
('admin', '$2a$10$fJqRS8IPTGcTaeJtro8CT.rwCljPjrRJwL4X1MtJYdAa6viyknS2K', 'admin@email.com');
