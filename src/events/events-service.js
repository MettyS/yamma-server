const EventsService = {
  getEvents(db, page = 0) {
    // enable pagination. Limits results to "limit" (50) per page
    const limit = 50,
      offset = limit * page;
    return db('events').select('*').offset(offset).limit(limit);
  },
  addEvent(db, event) {
    return db('events')
      .insert({
        title: event.title,
        categories: event.categories,
        description: event.description,
        date_created: db.raw(`to_timestamp(?)`, event.date_created),
      })
      .returning('*')
      .then(([addedEvent]) => addedEvent);
  },
  deleteEvent(db, id) {
    return db('events').where({ id }).delete();
  },
  getEventById(db, event_id) {
    return db('events').select('*').where({ id }).first();
  },
  // TODO
  getEventsByCategory(db, categories) {
    /* IMPLEMENT ME */
  },
  getEventsByDateRange(db, someRange) {
    /* IMPLEMENT ME */
  },
};

module.exports = EventsService;
