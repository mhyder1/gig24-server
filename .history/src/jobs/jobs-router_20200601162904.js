const express = require("express");
const xss = require("xss");

const JobsService = require("./jobs-service");
const { requireAuth } = require('../middleware/jwt-auth')
const jobsRouter = express.Router();
const jsonParser = express.json();

//serialize jobs in case of xss attack
const serializeJob = (job) => ({
  id: job.id,
  position: job.position,
  pay: job.pay,
  description: xss(job.description),
  duration: job.duration,
  location: job.location,
  term:job.term,
  user_id: job.user_id
});


jobsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    JobsService.getAllJobs(knexInstance)
      .then((jobs) => {
        res.json(jobs.map(serializeJob));
      })
      .catch(next);
  })
 
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const {
      position,
      pay,
      description,
      duration,
      location,
      term,
      user_id
    } = req.body
    const newJob = {
      position,
      pay,
      description,
      duration,
      location,
      term,
      user_id
    };
  
    //each value in new job is required, verify that they were sent
    for (const [key, value] of Object.entries(newJob)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    JobsService.insertJob(knexInstance, newJob)
      .then((job) => {
        res
          .status(201)
          .location(req.originalUrl + `/${job.id}`)
          .json(serializeJob(job));
      })
      .catch(next);
  });

  //get jobs created by an employer
  jobsRouter
  .route("/byuser/:id")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const empId = req.params.id;

    JobsService.getJobsByUser(knexInstance, empId)
      .then((jobs) => {
        if (!jobs) {
          return res.status(404).json({
            error: { message: `Jobs doesn't exist` },
          });
        }
        res.json(jobs) 
      })
      .catch(error=>console.log(error));
  })

jobsRouter
.route("/gigs/:id")
.get((req, res) => {
  
})

//get, update, or delete specific job
jobsRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const jobId = req.params.id;

    JobsService.getJobById(knexInstance, jobId)
      .then((job) => {
        if (!job) {
          return res.status(404).json({
            error: { message: `Job doesn't exist` },
          });
        }
        res.job = job
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeJob(res.job));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const deleteJobId = req.params.id;
    console.log(deleteJobId)
    JobsService.deleteJob(knexInstance, deleteJobId)
      .then(() => res.status(204).end())
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
      // res.json('Patch')
    const knexInstance = req.app.get('db');
    const updateJobId = req.params.id;
    const {  position, pay, description, duration, location, term, user_id } = req.body;
    const updatedJob = {  position, pay, description, duration, location, term, user_id };
 console.log(updatedJob)
    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedJob).filter(Boolean).length
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { message: `Request body must contain either position, pay, description, duration, location, term'`}
        });
    }

    // updatedEvent.time_of_event = new Date();
    // console.log(updateEventId, updatedEvent)
    JobsService.updateJob(knexInstance, updateJobId, updatedJob)
     .then((job) => res.json(job))
     .catch(next);
  });

module.exports = jobsRouter;