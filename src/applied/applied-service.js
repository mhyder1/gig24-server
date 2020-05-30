const AppliedService = {
    getAllApplications(knex){
        return knex
         .select('*')
         .from('applied');
    },
    insertApplication(knex, newApplication){
        return knex
         .insert(newApplication)
         .into('applied')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getApplicationById(knex, applicationId){
        return knex
         .select('*')
         .from('applied')
         .where('id', applicationId)
         .first(); //get event itself
    },
    deleteApplication(knex, applicationId){
        return knex('applied')
         .where('id', applicationId)
         .delete();
    },
  
  };

  module.exports = AppliedService; 