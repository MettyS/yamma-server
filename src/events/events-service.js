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
        event_img: event.event_img,
        source_name: event.source_name,
        source_url: event.source_url,
        source_img: event.source_img,
        date_published: event.date_published,
      })
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
      .update(event, (returning = true))
      .where({
        id: event_id,
      })
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  // TODO
  getEventsByCategory(db, category) {
    //  ~*
    // `.*${category}.*`
    const regexPattern = `.*${category}.*`;
    // new RegExp('\\b('+words.join('|')+')\\b')
    return db('events').select('*').where('categories', '~*', regexPattern);
  },
  getEventsByDateRange(db, someRange) {
    /* IMPLEMENT ME */
  },
};

module.exports = EventsService;
