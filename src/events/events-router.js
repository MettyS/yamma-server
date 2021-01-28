const express = require('express');

// middleware
const xss = require('xss');
const requireWorkerAuth = require('../middleware/worker-auth');
const jsonParser = express.json();

// events Service file for Controller connection to Model
// ( db knex connection postgres queries )
const EventsService = require('./events-service');

// initialize eventsRouter as new express.Router()
const eventsRouter = express.Router();

// expected keys for an incoming event
const expectedKeys = [
  'title',
  'categories',
  'description',
  'event_img',
  'source_name',
  'source_url',
  'source_img',
  'date_published',
];

class MissingKeyError extends Error {
  constructor(message) {
    super(message);
  }
}

// validate that event obj has all required fields
const validateKeys = (event) => {

  expectedKeys.forEach(key => {
    // skips check on categories
    if (key === 'categories') return;
    // if missing an expected key, throw a MissingKeyError
    if (!typeof(event[key]) || typeof(event[key]) === 'undefined') {
      throw new MissingKeyError(`Invalid event. "${key}" key is missing.`);
    }
  })

};

// serialize and sanitize event
const serializeEvent = (event) => {
  try {
    if (!event || !Object.keys(event).length) {
      throw new MissingKeyError('A not empty event object must be provided');
    }

    validateKeys(event);
    return {
      title: xss(event.title),
      categories: xss(event.categories) || '',
      description: xss(event.description),
      event_img: xss(event.event_img),
      source_name: xss(event.source_name),
      source_url: xss(event.source_url),
      source_img: xss(event.source_img),
      date_published: new Date(xss(event.date_published)),
    };
  } catch (er) {
    throw er;
  }
};

// sanitize a category string
const serializeCategory = (category) => {
  return xss(category);
};

// Define eventsRouter

// ROUTE /events/
eventsRouter
  .route('/')
  .get(jsonParser, (req, res, next) => {
    // expect optional category query
    const { category } = req.query,
      page = Number(req.query.page) || 0;

    // sanitize category that may exist
    const sanitizedCategory = serializeCategory(category);
    if (!sanitizedCategory) {
      // if there isn't a category, get all the events
      EventsService.getEvents(req.app.get('db'), page)
        .then((events) => {
          res.status(200).json({ events });
        })
        .catch((er) => {
          next(er);
        });
    } else {
      // if there is a category, get events with that category
      EventsService.getEventsByCategory(req.app.get('db'), sanitizedCategory)
        .then((events) => {
          res.status(200).json({ events });
        })
        .catch((er) => {
          next(er);
        });
    }
  })

  .post(requireWorkerAuth, jsonParser, (req, res, next) => {
    try {
      const { event } = req.body;

      // serializeEvent will throw a MissingKeyError handled in catch block 
      // if missing an expected key. See Line 40
      const serializedEvent = serializeEvent(event);

      // attempt to add the event
      EventsService.addEvent(req.app.get('db'), serializedEvent)
        .then((addedEvent) => {
          // if successful send response
          res.status(201).json({ addedEvent });
        })
        .catch((mainEr) => {
          // if unsuccessful, begin logic to check if existing duplicate
          // should have a category added
          try {
            // if the error fits the form of a duplicate insert error, enter block
            if (
              mainEr.detail &&
              mainEr.detail.slice(-15) === 'already exists.'
            ) {
              // get the duplicate event that already exists
              return EventsService.getEventByTitle(
                req.app.get('db'),
                serializedEvent.title
              )
                .then((existingEvent) => {
                  if (!existingEvent.categories.includes(serializedEvent.categories)) {
                    // if the existing duplicate event does not contain the new event's category enter block
                    // update existing event obj with new category
                    existingEvent.categories =
                      existingEvent.categories + ' ' + serializedEvent.categories;
                    // update the existing even in the db
                    EventsService.updateEventCategories(
                      req.app.get('db'),
                      existingEvent.id,
                      existingEvent
                    )
                      .then((rowsChanged) => {
                        // send message that categories were updated
                        return res.status(200).json({
                          message: 'already exists, categories updated? yes',
                        });
                      })
                      .catch((er) => next(er));
                  } 
                  else {
                    // the existing duplicate event does contain the same categories as incoming event
                    return res.status(200).json({
                      message: 'already exists, categories updated? no',
                    });
                  }
                })
                .catch((er) => next(er));
            } else {
              // the error is not a duplicate event insert error
              throw mainEr;
            }
          } catch (er) {
            // catch of main try block of additional logic
            next(mainEr);
          }
        });

    } catch (er) {
      // catch of main try block
      if (er instanceof MissingKeyError)
        return res.status(400).json({ error: {message: er.message }});
      next(er);
    }
  });

// ROUTE /events/:event_id
eventsRouter
  .route('/:event_id')
  .all((req, res, next) => {
    const { event_id } = req.params;
    // get event with incoming event_id
    EventsService.getEventById(req.app.get('db'), event_id)
      .then((eventWithId) => {
        // if there is no event send response
        if (!eventWithId)
          return res
            .status(404)
            .json({ error: { message: `Event does not exist` } });

        // set res.event to event
        res.event = eventWithId;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    // send the event
    res.json(res.event);
  })
  .delete((req, res, next) => {
    /* IMPLEMENT ME */
  });

// export eventsRouter
module.exports = eventsRouter;
