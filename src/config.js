module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DB_URL || 'postgresql://postgres@localhost/yamma',
	TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://postgres@localhost/yamma_test',
  JWT_SECRET: process.env.JWT_SECRET || 'yamma-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
};
