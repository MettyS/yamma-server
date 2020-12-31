const express = require('express');
const EventsService = require('./events-service');
const eventsRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

// HELPER:
const serializeEvent = (event) => {
  /* IMPLEMENT ME */
};

// TODO /events/
eventsRouter
  .route('/')
  .get((req, res, next) => {
    /* IMPLEMENT ME */
  })
  .post(jsonParser, (req, res, next) => {
    /* IMPLEMENT ME */
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
