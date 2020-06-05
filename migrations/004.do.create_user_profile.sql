DROP TABLE IF EXISTS user_profile;

CREATE TABLE user_profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  photo TEXT,
  about_me TEXT NOT NULL,
  education TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  imdb TEXT ,
  skillset TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
); 