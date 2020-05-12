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

//get all events and add new event
attendRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    AttendService.getAllAttendees(knexInstance)
      .then((attendees) => {
        // res.json(events.map(serializeEvent));
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



    // console.log(newEvent);
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

//get, update, or delete specific event
// attendRouter
//   .route("/:id")
//   // .all(requireAuth)
//   .all((req, res, next) => {
//     const knexInstance = req.app.get("db");
//     const attendId = req.params.id;

//     AttendService.getAttendById(knexInstance, attendId)
//       .then((attend) => {
//         if (!attend) {
//           return res.status(404).json({
//             error: { message: `Event doesn't exist` },
//           });
//         }
//         res.attend = attend
//         next();
//       })
//       .catch(next);
//   })
//   .get((req, res, next) => {
//     res.json(res.attend);
//   })
//   .delete((req, res, next) => {
//     const knexInstance = req.app.get("db");
//     const deleteEventId = req.params.id;

//     AttendService.deleteEvent(knexInstance, deleteEventId)
//       .then(() => res.status(204).end())
//       .catch(next);
//   })

//   .patch(jsonParser, (req, res, next) => {
//     const knexInstance = req.app.get('db');
//     const updateEventId = req.params.id;
//     const { title, description, address, type, time_of_event } = req.body;
//     const updatedEvent = { title, description, address, type, time_of_event };
//     // console.log(updatedEvent)
//     //check that at least one field is getting updated in order to patch
//     const numberOfValues = Object.values(updatedEvent).filter(Boolean).length
//     if(numberOfValues === 0){
//         return res.status(400).json({
//             error: { message: `Request body must contain either  title, description, address, time_of_event'`}
//         });
//     }

//     // updatedEvent.time_of_event = new Date();
//     // console.log(updateEventId, updatedEvent)
//     AttendService.updateEvent(knexInstance, updateEventId, updatedEvent)
//      .then((event) => {
//       return res.json(event);
//      })
//      .catch(next);
//   });

module.exports = attendRouter;