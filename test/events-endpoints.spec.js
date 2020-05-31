// const { expect } = require("chai");
// const knex = require("knex");
// const app = require("../src/app");
// const { makeEventsArray } = require("./events.fixtures");

// describe("Events Endpoints", function () {
//   let db;
//   //console.log(process.env.TEST_DB_URL)
//   before("make knex instance", () => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DB_URL,
//     });
//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//   before("clean the table", () => db("events").truncate());
//   afterEach("cleanup", () => db("events").truncate());

//   describe(`GET/ events`, () => {
//     context(`Given no events`, () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app).get("/api/events").expect(200, []);
//       });
//     });
//     context("Given there are events in the database", () => {
//       const testEvents = makeEventsArray();
//       beforeEach("insert events", () => {
//         return db.into("events").insert(testEvents);
//       });
//       it("responds with 200 and all of the events", () => {
//         return supertest(app).get("/api/events").expect(200, testEvents);
//         // TODO: add more assertions about the body
//       });
//     });
//   });
//   describe(`GET /events/:event_id`, () => {
//     context(`Given no events`, () => {
//       context(`Given an XSS attack article`, () => {
//         const maliciousEvent = {
//           id: 911,
//           parent_name: "XssMal",
//           title: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//           description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
//           address: "How-to NY",
//           type: "arts-crafts",
//           time_of_event: "2020-04-15T14:45:00.000Z",
//         };

//         beforeEach("insert malicious event", () => {
//           return db.into("events").insert([maliciousEvent]);
//         });

//         it("removes XSS attack content", () => {
//           return supertest(app)
//             .get(`/api/events/${maliciousEvent.id}`)
//             .expect(200)
//             .expect((res) => {
//               expect(res.body.title).to.eql(
//                 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
//               );
//               expect(res.body.description).to.eql(
//                 `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
//               );
//             });
//         });
//       });
//       it(`responds with 404`, () => {
//         const eventId = 1234;
//         return supertest(app)
//           .get(`/api/events/${eventId}`)
//           .expect(404, { error: { message: `Event doesn't exist` } });
//       });
//     });
//     context("Given there are events in the database", () => {
//       const testEvents = makeEventsArray();

//       beforeEach("insert events", () => {
//         return db.into("events").insert(testEvents);
//       });
//       it("It responds with 200 and the specified event", () => {
//         const eventId = 2;
//         const expectedEvent = testEvents[eventId - 1];
//         return supertest(app)
//           .get(`/api/events/${eventId}`)
//           .expect(200, expectedEvent);
//       });
//     });
//   });

//   describe(`POST /events`, () => {
//     it(`It creates an event, responding with 201 and the new event`, function () {
//       this.retries(3);
//       const newEvent = {
//         parent_name: "XssName1",
//         title: "Test new event",
//         description:
//           "Lorem ipsum dolor sit amet consectetur adipisius veniam consectetur tempora, corporis obcaectenetur, uamListicle",
//         address: "Test Xss address 100",
//         time_of_event: "2020-04-15T14:45:00.000Z",
//         type: "arts-crafts",
//       };
//       return supertest(app)
//         .post("/api/events")
//         .send(newEvent)
//         .expect(201)
//         .expect((res) => {
//           expect(res.body.parent_name).to.eql(newEvent.parent_name);
//           expect(res.body.title).to.eql(newEvent.title);
//           expect(res.body.description).to.eql(newEvent.description);
//           expect(res.body.address).to.eql(newEvent.address);
//           expect(res.body.type).to.eql(newEvent.type);
//           expect(res.body.time_of_event).to.eql(newEvent.time_of_event);
//           expect(res.body).to.have.property("id");
//           expect(res.headers.location).to.eql(`/api/events/${res.body.id}`);
//           // const expected = new Date().toLocaleString()
//           // const actual = new Date(res.body.time_of_event).toLocaleString()
//           //expect(actual).to.eql(expected)
//         })
//         .then((eventRes) =>
//           supertest(app)
//             .get(`/api/events/${eventRes.body.id}`)
//             .expect(eventRes.body)
//         );
//     });
//     const requiredFields = [
//       "parent_name",
//       "title",
//       "description",
//       "address",
//       "type",
//       "time_of_event",
//     ];
//     requiredFields.forEach((field) => {
//       const newEvent = {
//         parent_name: "XssName1",
//         title: "Test new event",
//         description:
//           "Lorem ipsum dolor sit amet consectetur adipisius veniam consectetur tempora, corporis obcaectenetur, uamListicle",
//         address: "Test Xss address 100",
//         time_of_event: "2020-04-15T14:45:00.000Z",
//         type: "arts-crafts",
//       };
//       it(`responds with 400 and an error message when the '${field}' is missing`, () => {
//         delete newEvent[field];

//         return supertest(app)
//           .post("/api/events")
//           .send(newEvent)
//           .expect(400, {
//             error: { message: `Missing '${field}' in request body` },
//           })
//         })
//     });
//   });
//   describe(`DELETE /api/events/:event_id`, () => {
//     context(`Given no events`, () => {
//         it(`responds with 404`, () => {
//           const eventId = 1234
//           return supertest(app)
//             .delete(`/api/events/${eventId}`)
//             .expect(404, { error: { message: `Event doesn't exist` } })
//         })
//       })
//     context('Given there are events in the database', () => {
//       const testEvents = makeEventsArray()
  
//       beforeEach('insert events', () => {
//         return db
//           .into('events')
//           .insert(testEvents)
//       })
  
//       it('responds with 204 and removes the event', () => {
//         const idToRemove = 2
//         const expectedEvents = testEvents.filter(event => event.id !== idToRemove)
//         return supertest(app)
//           .delete(`/api/events/${idToRemove}`)
//           .expect(204)
//           .then(res =>
//             supertest(app)
//               .get(`/api/events`)
//               .expect(expectedEvents)
//           )
//       })
//     })
// })
// })

