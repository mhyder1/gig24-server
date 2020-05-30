module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://dunder-mifflin@localhost/gig24",
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder-mifflin@localhost/gig24-test",
  JWT_SECRET: process.env.JWT_SECRET || 'anarchalk',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}