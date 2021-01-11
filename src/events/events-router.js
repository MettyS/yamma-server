const express = require('express');
const xss = require('xss');
const EventsService = require('./events-service');
const requireWorkerAuth = require('../middleware/worker-auth');
const eventsRouter = express.Router();
const jsonParser = express.json();

// HELPER:
const serializeEvent = (event) => {
  const serialEvent = {
    title: xss(event.title),
    categories: xss(event.categories),
    description: xss(event.description),
    //valueOf gets milisecs since UNIX epoch. standard UTC uses seconds instead so divide by 1000 to get seconds
    date_created: (new Date(event.date_created)).valueOf() / 1000 || (new Date()).valueOf() / 1000,
  };
  for (const [key, val] of Object.entries(serialEvent)) {
    if (key === 'categories') continue;
    if (!val) {
      const error = new Error(`Invalid ${key}`);
      error.validationError = true;
      throw error;
    }
    return serialEvent;
  }
};

// TODO /events/
eventsRouter
  .route('/')
  .get((req, res, next) => {
    /* IMPLEMENT ME */
  })
  .post(requireWorkerAuth, jsonParser, async (req, res, next) => {
    try {
      const event = serializeEvent(req.body);
      await EventsService.addEvent(req.app.get('db'), event);
      res.status(201).send('{}');
    } catch (e) {
      if (e.validationError)
        return res.status(400).json({ message: e.message });
      next(e);
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
    res.json(this.serializeEvent(res.event));
  })
  .delete((req, res, next) => {
    /* IMPLEMENT ME */
  });

module.exports = eventsRouter;
