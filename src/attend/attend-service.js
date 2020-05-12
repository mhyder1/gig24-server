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
    deleteEvent(knex, eventId){
        return knex('events')
         .where('id', eventId)
         .delete();
    },
    updateEvent(knex, eventId, updatedEvent){
        return knex('events')
         .where('id', eventId)
         .update(updatedEvent)
         .returning('*')
         .then(rows => { return rows[0] });
    }
  };

  module.exports = AttendService; 