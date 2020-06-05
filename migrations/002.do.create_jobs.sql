DROP TABLE IF EXISTS jobs;

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  position TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  requirements TEXT NOT NULL,
  description TEXT NOT NULL,
  member BOOLEAN,
  location TEXT NOT NULL,
  pay TEXT NOT NULL,
  duration TEXT NOT NULL,
  unit TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);


    
  
  
   