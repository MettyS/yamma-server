
const EventsService = {
  getEvents(db) {
    return db('events')
      .select('*');
  },
  addEvent(db, event) {
    return db('events')
      .insert(event)
      .returning('*')
      .then( ([addedEvent]) => addedEvent);
  },
  deleteEvent(db, id) {
    return db('events')
      .where({ id })
      .delete();
  },
  getEventById(db, event_id) {
    return db('events')
      .select('*')
      .where({ id })
      .first();
  },
  // TODO
  getEventsByCategory(db, categories) {
    /* IMPLEMENT ME */
  },
  getEventsByDateRange(db, someRange) {
    /* IMPLEMENT ME */
  }
  
  };
  
  module.exports = EventsService;