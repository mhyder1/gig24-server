DROP TABLE IF EXISTS emp_profile;

CREATE TABLE emp_profile (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  about_us TEXT NOT NULL,
  email TEXT NOT NULL,
  fax TEXT NOT NULL,
  website TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
); 