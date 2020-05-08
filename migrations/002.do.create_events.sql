CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  parent_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time_of_event TIMESTAMPTZ DEFAULT now() NOT NULL
);
