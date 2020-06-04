BEGIN;

TRUNCATE
  users,
  jobs,
  applied,
  user_profile,
  emp_profile;
  -- RESTART IDENTITY CASCADE;

INSERT INTO users (username, fullname, password, employer)
VALUES
  ('dunder', 'Dunder Mifflin', 'password', FALSE),
  ('jason', 'Jason Bourne', 'jason', FALSE),
  ('jasmine', 'Jasmin Guy', 'jasmine', FALSE),
  ('sam', 'Sam Smith', 'sam', TRUE),
  ('chris', 'Christopher Nolan', 'chris', TRUE),
  ('steve', 'Steven Spielberg', 'steve', TRUE);

INSERT INTO jobs (position, location, pay, duration, description, term, user_id)
VALUES
  ('Key grip','California', 50,'6 weeks', 'New movie','freelance',4 ),
  ('Editor','New York', 64, '2 months', 'Independent film', 'full time', 5),
  ('Actor','Chicago', 75, '7 days','Commercial', 'full time', 6);

INSERT INTO user_profile(name, location, about_me, phone, email, education, imdb, skillset, user_id)
VALUES
  ('dunder', 'Arizona', 'Im an actor','111-222-3333', 'dunder@mail.com', 'School of film,','imdb stuff','Lots of skills', 1),
  ('jason', 'Texas', 'Im an editor','555-555-5555', 'dunder@mail.com', 'Arts Academy,','imdb stuff','Many skills', 2),
  ('jasmine', 'Philadelphia', 'Im a director','987-222-2345', 'dunder@mail.com', 'University of movies,','imdb stuff','Tons of skills', 3);

INSERT INTO emp_profile(company_name, phone, location, about_us, email, fax, website, user_id)
VALUES
  ('Orion Studios', '111-111-1111', 'California', 'Since 1903', 'info@orion.com', '444-444-4444','http://www.orion.com',4),
  ('Bad Robot Films', '222-222-2222', 'New York', 'Produces starwars', 'info@badrobot.com', '555-555-5555', 'http://www.badrobot.com',5),
  ('Paramount Studios', '333-333-3333', 'Chicago', 'Best in the business', 'info@paramount.com', '666-666-6666', 'http://www.paramount.com',6);

INSERT INTO applied (user_id, job_id, completed)
VALUES
  (1,1,FALSE),
  (1,2,FALSE),
  (2,2,FALSE),
  (2,3,FALSE),
  (3,1,FALSE),
  (3,3,FALSE);
  
COMMIT;