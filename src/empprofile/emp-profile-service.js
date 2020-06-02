const EmpProfileService = {
    getAllProfiles(knex){
        return knex
         .select('*')
         .from('emp_profile');
    },
    insertProfile(knex, newProfile){
        return knex
         .insert(newProfile)
         .into('emp_profile')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getProfileById(knex, profileId){
        return knex
         .select('*')
         .from('emp_profile')
         .where('id', profileId)
         .first(); //get event itself
    },

    getProfileByUser(knex, user_id){
        return knex
         .select('*')
         .from('emp_profile')
         .where('user_id', user_id)
         .first(); //get event itself
    },
    deleteProfile(knex, profileId){
        return knex('emp_profile')
         .where('id', profileId)
         .delete();
    },
    updateProfile(knex, profileId, updatedProfile){
        console.log(profileId,updatedProfile)
        return knex('emp_profile')
         .where('id', profileId)
         .update(updatedProfile)
         .returning('*')
         .then(rows => { return rows[0] });
    }
  };
  
  module.exports = EmpProfileService;