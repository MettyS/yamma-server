const express = require('express');
const xss = require('xss');
const EventsService = require('./events-service');
const requireWorkerAuth = require('../middleware/worker-auth');
const eventsRouter = express.Router();
const jsonParser = express.json();

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

// validate that event obj has all required fields
const validateKeys = (event) => {
  let missingKeys = [];
  expectedKeys.forEach((key) => {
    if (!event[key]) missingKeys.push(key);
  });
  return missingKeys.join(', ');
};

// serialize and sanitize event
const serializeEvent = (event) => {
  try {
    if (!event || !Object.keys(event).length)
      throw new Error('A not empty comment object must be provided');

    const missingKeys = validateKeys(event);
    if (missingKeys !== '')
      throw new Error(`Fields ${missingKeys} must be provided`);
    return {
      title: xss(event.title),
      categories: xss(event.categories),
      description: xss(event.description),
      event_img: xss(event.event_img),
      source_name: xss(event.source_name),
      source_url: xss(event.source_url),
      source_img: xss(event.source_img),
      date_published: new Date(xss(event.date_published)),
    };
  } catch (er) {
    console.log('error: ', er);
    return { error: er };
  }
};

const serializeCategory = (category) => {
  return xss(category);
};

// TODO /events/
eventsRouter
  .route('/')
  .get(jsonParser, (req, res, next) => {
    const { category } = req.query,
      page = Number(req.query.page) || 0;
    console.log('incoming category requested is: ', category);
    const sanitizedCategory = serializeCategory(category);
    console.log('sanitizedCategory is: ', sanitizedCategory);
    if (!sanitizedCategory || sanitizedCategory === 'US') {
      EventsService.getEvents(req.app.get('db'), page)
        .then((events) => {
          res.status(200).json({ events });
        })
        .catch((er) => {
          console.log('er at 66', er);
          next(er);
        });
    } else {
      console.log('about to search for a specific category');
      EventsService.getEventsByCategory(req.app.get('db'), sanitizedCategory)
        .then((events) => {
          res.status(200).json({ events });
        })
        .catch((er) => {
          console.log('er at 76', er);
          next(er);
        });
    }
  })
  .post(requireWorkerAuth, jsonParser, (req, res, next) => {
    try {
      let { event } = req.body;
      console.log('the incoming event is: ', event);
      event = serializeEvent(event);

      if (event.error) return res.status(400).json({ event });

      EventsService.addEvent(req.app.get('db'), event)
        .then((addedEvent) => {
          res.status(201).json({ addedEvent });
        })
        .catch((mainEr) => {
          try {
            if (
              mainEr.detail &&
              mainEr.detail.slice(-15) === 'already exists.'
            ) {
              console.log(
                '********** DETECTED DUPLICATE VALUE INSERT ATTEMPT **********'
              );
              return EventsService.getEventByTitle(
                req.app.get('db'),
                event.title
              )
                .then((existingEvent) => {
                  /*return res.status(400).json({error: {
                    message: 'attempted to insert duplicate',
                    oldEvent: existingEvent,
                    badEvent: event
                  }})*/

                  if (!existingEvent.categories.includes(event.categories)) {
                    existingEvent.categories =
                      existingEvent.categories + ' ' + event.categories;
                    EventsService.updateEventCategories(
                      req.app.get('db'),
                      existingEvent.id,
                      existingEvent
                    )
                      .then((rowsChanged) => {
                        return res.status(200).json({
                          message: 'already exists, categories updated? yes',
                        });
                      })
                      .catch((er) => next(er));
                  } else {
                    return res.status(200).json({
                      message: 'already exists, categories updated? no',
                    });
                  }
                })
                .catch((er) => next(er));
            } else {
              return res.status(400).json({
                error: {
                  mainEr,
                  badEvent: event,
                },
              });
            }
          } catch (er) {
            next(mainEr);
          }
        });
    } catch (er) {
      next(er);
    }
  });

// TODO /events/:event_id
eventsRouter
  .route('/:event_id')
  .all((req, res, next) => {
    const { event_id } = req.params;
    EventsService.getEventById(req.app.get('db'), event_id)
      .then((eventWithId) => {
        if (!eventWithId)
          return res
            .status(404)
            .json({ error: { message: `Event does not exist` } });

        res.event = eventWithId;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.event);
  })
  .delete((req, res, next) => {
    /* IMPLEMENT ME */
  });

module.exports = eventsRouter;
