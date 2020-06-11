require("dotenv").config();
const { TEST_DATABASE_URL } = require('../src/config')
const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeAppliedArray } = require("./applied.fixtures");

describe("Applied Endpoints", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("create users table", () => db.raw(
      `
     DROP TABLE IF EXISTS applied, jobs, users;

     CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fullname TEXT NOT NULL,
        username TEXT NOT NULL,
        password VARCHAR NOT NULL,
        employer BOOLEAN DEFAULT FALSE
      );
      
      INSERT INTO users (username, fullname, password, employer)
        VALUES
        ('dunder', 'Dunder Mifflin', 'password', FALSE),
        ('jason', 'Jason Bourne', 'jason', FALSE),
        ('jasmine', 'Jasmin Guy', 'jasmine', FALSE),
        ('sam', 'Sam Smith', 'sam', TRUE),
        ('chris', 'Christopher Nolan', 'chris', TRUE),
        ('steve', 'Steven Spielberg', 'steve', TRUE);
      `
  ));

  before("create jobs table", () => db.raw(
    `DROP TABLE IF EXISTS jobs;

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
    
    INSERT INTO jobs ( position, title, type, requirements, description, member, location, pay, duration, unit, user_id)
    VALUES
      ('Key grip', '10 Days Around the States', 'Travel Show','Experienced','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', TRUE, 'East Coast', 'low-budget', '6','Days', 4 ),
      ('Editor','How To Not Become Like Your Dad', 'Independent film','Good Communication skills',' Quis lectus nulla at volutpat diam. Ornare arcu dui vivamus arcu felis bibendum ut tristique. Molestie at elementum eu facilisis. Sem integer ', FALSE ,'New York', 'Full-time', '2' ,'week', 5),
      ('Actor',' Finding Daniel Russo','Documentary','Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget ', 'Purus non enim praesent elementum facilisis leo vel fringilla est. ' , TRUE, 'Atlanta, GA' ,'part-time', '12', 'months', 6);
    `
));

before("create applied table", () => db.raw(
 `
  DROP TABLE IF EXISTS applied;

  CREATE TABLE applied (
    id SERIAL PRIMARY KEY,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
    app_date TIMESTAMPTZ DEFAULT now() NOT NULL, 
    UNIQUE(user_id, job_id)
  ); 
 `
));

  before("clean the table", () => db("applied").truncate());
  afterEach("cleanup", () => db("applied").truncate());

  describe(`GET/ applied`, () => {
    context(`Given no applications`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/applied").expect(200, []);
      });
    });
    context("Given there are applications in the database", () => {
      const testApplications = makeAppliedArray();
      beforeEach("insert applications", () => {
        return db.into("applied").insert(testApplications);
      });
      it("responds with 200 and all of the applications", () => {
        return supertest(app).get("/api/applied").expect(200, testApplications);
        // TODO: add more assertions about the body
      });
    });
  });

  describe(`GET /applied/:applied_id`, () => {
    context(`Given no applications`, () => {
      it(`responds with 404`, () => {
        const applicationId = 1234;
        return supertest(app)
          .get(`/api/applied/${applicationId}`)
          .expect(404, { error: { message: `Application doesn't exist` } });
      });
    });
    context("Given there are applications in the database", () => {
      const testApplications = makeAppliedArray();

      beforeEach("insert applications", () => {
        return db.into("applied").insert(testApplications);
      });
      it("It responds with 200 and the specified application", () => {
        const applicationId = 2;
        const expectedApplication= testApplications[applicationId - 1];
        return supertest(app)
          .get(`/api/applied/${applicationId}`)
          .expect(200, expectedApplication);
      });
    });
  });

  describe(`POST /applied`, () => {
    it(`It creates an application, responding with 201 and the new application`, function () {
      this.retries(3);
      const newApplication = {
        completed: false,
        user_id: 1,
        job_id: 1,
        app_date: "2020-05-10T13:30:00.000Z"
      };
      return supertest(app)
        .post("/api/applied")
        .send(newApplication)
        .expect(201)
        .expect((res) => {
          expect(res.body.completed).to.eql(newApplication.completed);
          expect(res.body.user_id).to.eql(newApplication.user_id);
          expect(res.body.job_id).to.eql(newApplication.job_id);
          expect(res.body.app_date).to.eql(newApplication.app_date);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/applied/${res.body.id}`);
        })
        .then((applicationRes) =>
          supertest(app)
            .get(`/api/applied/${applicationRes.body.id}`)
            .expect(applicationRes.body)
        );
    });
    const requiredFields = [
      "completed",
      "user_id",
      "job_id",
      "app_date",
    ];
    requiredFields.forEach((field) => {
      const newApplication = {
        id: 1,
        completed: false,
        user_id: 1,
        job_id: 1,
        app_date: "2020-05-10T13:30:00.000Z"
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newApplication[field];

        return supertest(app)
          .post("/api/applied")
          .send(newApplication)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          })
        })
    });
  });

  describe(`DELETE /api/applied/:applied_id`, () => {
    context(`Given no applications`, () => {
        it(`responds with 404`, () => {
          const applicationId = 1234
          return supertest(app)
            .delete(`/api/applied/${applicationId}`)
            .expect(404, { error: { message: `Application doesn't exist` } })
        })
      })
    context('Given there are applications in the database', () => {
      const testApplications = makeAppliedArray()
  
      beforeEach('insert applicaion', () => {
        return db
          .into('applied')
          .insert(testApplications)
      })
  
      it('responds with 204 and removes the application', () => {
        const idToRemove = 2
        const expectedApplications = testApplications.filter(application => application.id !== idToRemove)
        return supertest(app)
          .delete(`/api/applied/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/applied`)
              .expect(expectedApplications)
          )
      })
    })
})
})

