const JobsService = {
    getAllJobs(knex){
        return knex
         .select('*')
         .from('jobs');
    },
    insertJob(knex, newJob){
        return knex
         .insert(newJob)
         .into('jobs')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getJobById(knex, jobId){
        return knex
         .select('*')
         .from('jobs')
         .where('id', jobId)
         .first(); //get event itself
    },
    deleteJob(knex, jobId){
        return knex('jobs')
         .where('id', jobId)
         .delete();
    },
    updateJob(knex, jobId, updatedJob){
        console.log(jobId,updatedJob)
        return knex('jobs')
         .where('id', jobId)
         .update(updatedJob)
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getJobsByUser(knex, empId) {
        return knex
        .select('*')
        .from('jobs')
        .where('user_id', empId)
    }
  };
  
  module.exports = JobsService;