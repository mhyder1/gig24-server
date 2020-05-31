DROP TABLE IF EXISTS user_profile;

CREATE TABLE user_profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  about_me TEXT NOT NULL,
  education TEXT NOT NULL,
  imdb TEXT NOT NULL,
  skillset TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
); 