const AttendService = {
    getAllAttendees(knex){
        return knex
         .select('*')
         .from('attend');
    },
    insertAttend(knex, newAttend){
        return knex
         .insert(newAttend)
         .into('attend')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getAttendById(knex, attendId){
        return knex
         .select('*')
         .from('attend')
         .where('id', attendId)
         .first(); //get event itself
    },
    deleteAttend(knex, attendId){
        return knex('attend')
         .where('id', attendId)
         .delete();
    },
  
  };

  module.exports = AttendService; 