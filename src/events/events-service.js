const EventsService = {
  getEvents(db) {
    return db('events').select('*');
  },
  addEvent(db, event) {
    return db('events')
      .insert(event)
      .returning('*')
      .then(([addedEvent]) => addedEvent);
  },
  deleteEvent(db, id) {
    return db('events').where({ id }).delete();
  },
  getEventById(db, id) {
    return db('events').select('*').where({ id }).first();
  },
  getEventByTitle(db, title) {
    return db('events').select('*').where({ title }).first();
  },
  updateEventCategories(db, event_id, event) {
    return db('events')
      .update(event, returning = true)
      .where({
          id: event_id
      })
      .returning('*')
      .then(rows => {
          return rows[0];
      });
  },
  // TODO
  getEventsByCategory(db, category) {
    //  ~*
    // `.*${category}.*`
    const regexPattern = `.*${category}.*`;
    // new RegExp('\\b('+words.join('|')+')\\b')
    return db('events')
      .select('*')
      .where('categories', '~*', regexPattern)

  },
  getEventsByDateRange(db, someRange) {
    /* IMPLEMENT ME */
  },
};

module.exports = EventsService;
