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
    jobsAppliedToByUser(knex, user_id){
        return knex.raw(
            `SELECT jobs.*, users.fullname
            FROM jobs, users, applied
            WHERE jobs.id = applied.job_id
            AND applied.user_id = ${user_id}
            AND users.id = ${user_id}
            `
        )
    },
    getCurrentApplicants(knex, emp_id) {
        return knex.raw(
            `SELECT jobs.description, users.fullname, jobs.position, users.id as user_id
            FROM jobs, users, applied
            WHERE jobs.user_id = ${emp_id}
            AND applied.user_id = users.id
            AND applied.job_id = jobs.id
            `
        )
    },
    deleteApplication(knex, applicationId){
        return knex('applied')
         .where('id', applicationId)
         .delete();
    },
  
  };

  module.exports = AppliedService; 