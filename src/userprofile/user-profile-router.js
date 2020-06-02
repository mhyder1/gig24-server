const express = require("express");
const xss = require("xss");

const UserProfileService = require("./user-profile-service");
const { requireAuth } = require('../middleware/jwt-auth')
const userProfileRouter = express.Router();
const jsonParser = express.json();

//serialize profile in case of xss attack
const serializeProfile = (profile) => ({
  id: profile.id,
  name: profile.name,
  about_me: xss(profile.about_me),
  photo: profile.photo,
  education: xss(profile.education),
  location: profile.location,
  skillset:profile.skillset,
  imdb:profile.imdb,
  user_id: profile.user_id
});


userProfileRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    UserProfileService.getAllProfiles(knexInstance)
      .then((profiles) => {
        res.json(profiles.map(serializeProfile));
      })
      .catch(next);
  })
 
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const {
      name,
      about_me,
      // photo,
      education,
      location,
      imdb,
      skillset,
      user_id
    } = req.body
    const newProfile = {
      name,
      about_me,
      // photo,
      education,
      location,
      imdb,
      skillset,
      user_id
    };
  console.log(newProfile)
    //each value in new profile is required, verify that they were sent
    for (const [key, value] of Object.entries(newProfile)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    UserProfileService.insertProfile(knexInstance, newProfile)
      .then((profile) => {
        res
          .status(201)
          .location(req.originalUrl + `/${profile.id}`)
          .json(serializeProfile(profile));
      })
      .catch(next);
  });

//get, update, or delete specific profile
userProfileRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const profileId = req.params.id;

    UserProfileService.getProfileById(knexInstance, profileId)
      .then((profile) => {
        if (!profile) {
          return res.status(404).json({
            error: { message: `Profile doesn't exist` },
          });
        }
        res.profile = profile
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeProfile(res.profile));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const deleteProfileId = req.params.id;
    console.log(deleteProfileId)
    UserProfileService.deleteProfile(knexInstance, deleteProfileId)
      .then(() => res.status(204).end())
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
      // res.json('Patch')
    const knexInstance = req.app.get('db');
    const deleteProfileId = req.params.id;
    const { name, about_me, photo, education, duration, location, imdb, skillset, user_id } = req.body;
    const updatedProfile = {  name, about_me, photo, education, duration, location, imdb, skillset, user_id };
 console.log(updatedProfile)
    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedProfile).filter(Boolean).length
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { message: `Request body must contain either name, about_me, photo, education, duration, location, imdb, skillset'`}
        });
    }

    // updatedEvent.time_of_event = new Date();
    // console.log(updateEventId, updatedEvent)
    UserProfileService.updateProfile(knexInstance, deleteProfileId, updatedProfile)
     .then((profile) => res.json(profile))
     .catch(next);
  });

module.exports = userProfileRouter;