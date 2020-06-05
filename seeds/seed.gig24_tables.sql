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

INSERT INTO jobs ( position, title, type, requirements, description, membery, location, pay, duration, week, user_id)
VALUES
  ('Key grip', '10 Days Around the States', 'Travel Show','Experienced','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Yes', 'East Coast', 'low-budget', '6','Days',4 ),
  ('Editor','How To Not Become Like Your Dad', 'Independent film','Good Communication skills',' Quis lectus nulla at volutpat diam. Ornare arcu dui vivamus arcu felis bibendum ut tristique. Molestie at elementum eu facilisis. Sem integer ','No','New York', 'Full-time', 2 ,'week', 5),
  ('Actor',' Finding Daniel Russo','Documentary','Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget ', 'Purus non enim praesent elementum facilisis leo vel fringilla est. ' , 'Yes', 'Atlanta, GA' ,'part-time', 12, 'months', 6);

INSERT INTO user_profile(name, position, location, about_me, education, imdb, skillset, user_id)
VALUES
  ('Dunder', 'Actor', 'Pheonix, AZ', 'Im an actor.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'School of film,','imdb stuff','Lots of skills', 1),
  ('jason', 'Editor', 'Austin, TX', 'Im an editor.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'Arts Academy,','imdb stuff','Many skills', 2),
  ('jasmine', 'Production Assistant', 'Philadelphia, PA', 'Im a PA. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'University of movies,','imdb stuff','Tons of skills', 3);

INSERT INTO emp_profile(company_name, phone, location, about_us, email, fax, website, user_id)
VALUES
  ('Orion Studios', '111-111-1111', 'Los Angeles,CA', 'Since 1903', 'info@orion.com', '444-444-4444','http://www.orion.com',4),
  ('Bad Robot Films', '222-222-2222', 'New York, NY', 'Produces starwars', 'info@badrobot.com', '555-555-5555', 'http://www.badrobot.com',5),
  ('Paramount Studios', '333-333-3333', 'Chicago, IL', 'Best in the business', 'info@paramount.com', '666-666-6666', 'http://www.paramount.com',6);

INSERT INTO applied (user_id, job_id, completed)
VALUES
  (1,1,FALSE),
  (1,2,FALSE),
  (2,2,FALSE),
  (2,3,FALSE),
  (3,1,FALSE),
  (3,3,FALSE);
  
COMMIT;