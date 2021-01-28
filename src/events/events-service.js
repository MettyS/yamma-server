const EventsService = {
  // get events
  getEvents(db, page = 0) {
    // enable pagination. Limits results to "limit" (50) per page
    const limit = 50,
      offset = limit * page;
    return db('events').select('*').offset(offset).limit(limit);
  },
  // get event with id
  getEventById(db, id) {
    return db('events').select('*').where({ id }).first();
  },
  // get event with title
  getEventByTitle(db, title) {
    return db('events').select('*').where({ title }).first();
  },
  // get events with category
  getEventsByCategory(db, category) {
    // regex pattern of category in any position in string
    const regexPattern = `.*${category}.*`;
    return db('events').select('*').where('categories', '~*', regexPattern);
  },
  // add an event
  addEvent(db, event) {
    return (
      db('events')
        .insert({
          title: event.title,
          categories: event.categories,
          description: event.description,
          event_img: event.event_img,
          source_name: event.source_name,
          source_url: event.source_url,
          source_img: event.source_img,
          date_published: event.date_published,
        })
        .returning('*')
        // return added event
        .then(([addedEvent]) => addedEvent)
    );
  },
  // update event (only used for category field)
  updateEventCategories(db, event_id, event) {
    return db('events')
      .update(event, (returning = true))
      .where({
        id: event_id,
      })
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  /* NOT IN USE */

  // delete event
  deleteEvent(db, id) {
    return db('events').where({ id }).delete();
  },
  // get events by published range
  getEventsByDateRange(db, someRange) {
    /* IMPLEMENT ME */
  },
};

module.exports = EventsService;
