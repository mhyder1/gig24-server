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
    getGigs(knex, user_id) {
        return knex.raw(
            `SELECT j.*,
            EXISTS (select ${user_id}
                     FROM applied a
                     WHERE a.job_id = j.id AND a.user_id = ${user_id}) AS js_id
            FROM jobs j;`
        )
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
    },
    getGigs(knex, user_id) {
        return knex.raw(
        `SELECT DISTINCT on (jobs.id) 
            jobs.*, applied.user_id,
           CASE WHEN applied.user_id = ${user_id} THEN TRUE  
                ELSE FALSE END as js_id
        FROM jobs 
        JOIN applied on jobs.id = applied.job_id;
            `
        )
    }
  };

  module.exports = JobsService;