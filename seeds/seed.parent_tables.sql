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

INSERT INTO events (parent_name, title, description, address, time_of_event, type)
VALUES
  ('Madie','Weekend Picnic', 'I am having a picnic this weekend','Culver city park 300 Jefferson blvd, Culver City, CA 90232.', '2020-05-10 13:30:00','outdoor-activities' ),
  ('Meek','Play Date', 'Welcome to our playdate this Friday', 'Central Park, 110 Central Park S. New York, NY 10019.', '2020-05-15 14:45:00', 'music-dance'),
  ('Jasmine','Tutoring', 'I need someone to tutor my 8 year old son', 'Little Library, 209 Pacific Palisades, Santa Monica, CA90405.','2020-05-20 17:00:00', 'tutoring'),
  ('Dana','Online Yoga with Dana', 'Cras semper sed sem ac consectetur. Ut lobortis lacus non dui accumsan viverra. Quisque eleifend libero vitae nunc venenatis malesuada','zoom', '2020-05-20 17:00:00', 'sport-fitness' ),
  ('Angela','Paint with Angela','Cras semper sed sem ac consectetur. Ut lobortis lacus non dui accumsan viverra.','Palisades Park, 1500 Ocean Dr, Santa Monica, CA90504', '2020-05-15 14:45:00', 'arts-crafts' ),
  ('Lawler','Hiking with Lawler and Sophia', 'Cras semper sed sem ac consectetur. Ut lobortis lacus non dui accumsan', 'Valley Vorge National Park, 100 King of Prussia, PA', '2020-05-10 13:30:00', 'outdoor-activities'  ),
  ('Sarah','Dance party with Sara', 'Cras semper sed sem ac consectetur. Ut lobortis','Park 100, Larkin St, San Francisco, CA 94102','2020-05-10 13:30:00','books-films'),
  ('Muhammad', 'Math Brain Teasers for Middleschoolers','Cras semper sed sem ac consectetur. Ut lobortis lacus non dui accumsan viverra. Quisque eleifend','National Park 100, Larkin St, San Francisco, CA 94102','2020-05-15 14:45:00','tutoring' );


COMMIT;
