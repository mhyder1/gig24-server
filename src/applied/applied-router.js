const express = require("express");
const xss = require("xss");

const AppliedService = require("./applied-service");
const { requireAuth } = require('../middleware/jwt-auth')
const appliedRouter = express.Router();
const jsonParser = express.json();

//serialize application in case of xss attack
const serializeApplied = (applied) => ({
  id: applied.id,
  job_id: applied.job_id,
  user_id: applied.user_id,
  completed: applied.completed
});


appliedRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    AppliedService.getAllApplications(knexInstance)
      .then((applicants) => {
         res.json(applicants);
      })
      .catch(next);
  })
  .post( jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const {
      job_id,
      user_id,
      completed
    } = req.body;

    const newApplication = {
      job_id,
      user_id,
      completed
    };


    //each value in new application is required, verify that they were sent
    for (const [key, value] of Object.entries(newApplication)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body'` },
        });
      }
    }

    AppliedService.insertApplication(knexInstance, newApplication)
      .then((application) => {
        res
          .status(201)
          .location(req.originalUrl + `/${application.id}`)
          .json(application);
      })
      .catch(next);
  });


appliedRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const applicationId = req.params.id;

    AppliedService.getApplicationById(knexInstance, applicationId)
      .then((application) => {
        if (!application) {
          return res.status(404).json({
            error: { message: `Application doesn't exist` },
          });
        }
        res.application = application
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.application);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const deleteApplicationId = req.params.id;

    AppliedService.deleteApplication(knexInstance, deleteApplicationId)
      .then(() => res.status(204).end())
      .catch(next);
  })


module.exports = appliedRouter;