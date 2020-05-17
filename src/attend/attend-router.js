const express = require("express");
const xss = require("xss");

const AttendService = require("./attend-service");
const { requireAuth } = require('../middleware/jwt-auth')
const attendRouter = express.Router();
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


attendRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    AttendService.getAllAttendees(knexInstance)
      .then((attendees) => {
         res.json(attendees);
      })
      .catch(next);
  })
  .post( jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const {
      guest,
      event,
      children
    } = req.body;

    console.log(guest, event, children)
    const newEvent = {
      guest,
      event,
      children,
    };


    //each value in new event is required, verify that they were sent
    for (const [key, value] of Object.entries(newEvent)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body'` },
        });
      }
    }

    AttendService.insertAttend(knexInstance, newEvent)
      .then((attend) => {
        res
          .status(201)
          .location(req.originalUrl + `/${attend.id}`)
          .json(attend);
      })
      .catch(next);
  });


attendRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const attendId = req.params.id;

    AttendService.getAttendById(knexInstance, attendId)
      .then((attend) => {
        if (!attend) {
          return res.status(404).json({
            error: { message: `Event doesn't exist` },
          });
        }
        res.attend = attend
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.attend);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const deleteEventId = req.params.id;

    AttendService.deleteAttend(knexInstance, deleteEventId)
      .then(() => res.status(204).end())
      .catch(next);
  })


module.exports = attendRouter;