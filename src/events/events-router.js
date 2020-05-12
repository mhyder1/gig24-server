const express = require("express");
const xss = require("xss");

const EventsService = require("./events-service");
const { requireAuth } = require('../middleware/jwt-auth')
const eventsRouter = express.Router();
const jsonParser = express.json();

//serialize events in case of xss attack
const serializeEvent = (event) => ({
  id: event.id,
  parent_name: xss(event.parent_name),
  title: event.title,
  description: xss(event.description),
  address: event.address,
  type:event.type,
  time_of_event: event.time_of_event,
  author: event.author
});

//get all events and add new event
eventsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    EventsService.getAllEvents(knexInstance)
      .then((events) => {
        res.json(events.map(serializeEvent));
      })
      .catch(next);
  })
 
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const {
      parent_name,
      title,
      description,
      address,
      type,
      time_of_event, author
    } = req.body
    const newEvent = {
      parent_name,
      title,
      description,
      address,
      type,
      time_of_event,author
    };
    //console.log(newEvent);
    //each value in new event is required, verify that they were sent
    for (const [key, value] of Object.entries(newEvent)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    EventsService.insertEvent(knexInstance, newEvent)
      .then((event) => {
        res
          .status(201)
          .location(req.originalUrl + `/${event.id}`)
          .json(serializeEvent(event));
      })
      .catch(next);
  });

//get, update, or delete specific event
eventsRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const eventId = req.params.id;

    EventsService.getEventById(knexInstance, eventId)
      .then((event) => {
        if (!event) {
          return res.status(404).json({
            error: { message: `Event doesn't exist` },
          });
        }
        res.event = event
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeEvent(res.event));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const deleteEventId = req.params.id;
    console.log(deleteEventId)
    EventsService.deleteEvent(knexInstance, deleteEventId)
      .then(() => res.status(204).end())
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
      // res.json('Patch')
    const knexInstance = req.app.get('db');
    const updateEventId = req.params.id;
    const {  parent_name, title, description, address, type, time_of_event } = req.body;
    const updatedEvent = {  parent_name, title, description, address, type, time_of_event };
 console.log(updatedEvent)
    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedEvent).filter(Boolean).length
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { message: `Request body must contain either parent_name, title, description, address, time_of_event'`}
        });
    }

    updatedEvent.time_of_event = new Date();
console.log(updateEventId, updatedEvent)
    EventsService.updateEvent(knexInstance, updateEventId, updatedEvent)
     .then((event) => res.json(event))
     .catch(next);
  });

module.exports = eventsRouter;

