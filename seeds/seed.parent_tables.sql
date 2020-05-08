BEGIN;

TRUNCATE
  users,
  events;
  -- RESTART IDENTITY CASCADE;

INSERT INTO users (username, fullname, password)
VALUES
  ('dunder', 'Dunder Mifflin', 'password'),
  ('deboop', 'Bodeep Deboop', 'bo-password'),
  ('bloggs', 'Charlie Bloggs', 'charlie-password'),
  ('smith', 'Sam Smith', 'sam-password'),
  ('lexlor', 'Alex Taylor', 'lex-password'),
  ('wippy', 'Ping Won In', 'ping-password');

INSERT INTO events (parent_name, title, description, time_of_event)
VALUES
  ('Madie','Weekend Picnic', 'I am having a picnic this weekend', '2020-05-10 13:30:00'),
  ('Meek','Play Date', 'Welcome to our playdate this Friday', '2020-05-15 14:45:00'),
  ('Jasmine','Tutoring', 'I need someone to tutor my 8 year old son', '2020-05-20 17:00:00');


COMMIT;
