const EventsService = {
    getAllEvents(knex){
        return knex
         .select('*')
         .from('events');
    },
    insertEvent(knex, newEvent){
        return knex
         .insert(newEvent)
         .into('events')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getEventById(knex, eventId){
        return knex
         .select('*')
         .from('events')
         .where('id', eventId)
         .first(); //get event itself
    },
    deleteEvent(knex, eventId){
        return knex('events')
         .where('id', eventId)
         .delete();
    },
    updateEvent(knex, eventId, updatedEvent){
        console.log(eventId,updatedEvent)
        return knex('events')
         .where('id', eventId)
         .update(updatedEvent);
    }
  };
  
  module.exports = EventsService;