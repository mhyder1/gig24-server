DROP TABLE IF EXISTS applied;

CREATE TABLE applied (
  id SERIAL PRIMARY KEY,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  UNIQUE(user_id, job_id)
); 