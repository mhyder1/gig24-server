const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const {makeEventsArray} = require('./events.fixtures')

describe('Events Endpoints', function() {
    let db
  //console.log(process.env.TEST_DB_URL)
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('events').truncate())
    afterEach('cleanup', () => db('events').truncate())

    describe(`GET/ events`, () => {
        context(`Given no events`, () => {
         it(`responds with 200 and an empty list`, () => {
           return supertest(app)
             .get('/api/events')
             .expect(200, [])
         })
       })
        context('Given there are events in the database', () => {
           const testEvents = makeEventsArray();
                 beforeEach('insert events', () => {
             return db
               .into('events')
               .insert(testEvents)
           })
           it('responds with 200 and all of the events', () => {
             return supertest(app)
               .get('/api/events')
               .expect(200, testEvents)
               // TODO: add more assertions about the body
           })
        })
    })
    describe(`GET /events/:event_id`, () => {
        context(`Given no events`, () => {
         it(`responds with 404`, () => {
           const eventId = 1234
           return supertest(app)
             .get(`/api/events/${eventId}`)
             .expect(404, { error: { message: `Event doesn't exist` } })
         })
       })
        context('Given there are events in the database', () => {
            const testEvents = makeEventsArray()
      
            beforeEach('insert events', () => {
              return db
                .into('events')
                .insert(testEvents)
            })
          it('It responds with 200 and the specified event', () => {
             const eventId = 2
             const expectedEvent = testEvents[eventId - 1]
             return supertest(app)
               .get(`/api/events/${eventId}`)
               .expect(200, expectedEvent)
           })
        })
    })
  })