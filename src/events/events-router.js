const express = require('express');
const EventsService = require('./events-service');
const eventsRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

const expectedKeys = ['title', 'categories', 'description'
                      , 'event_img', 'source_name', 'source_url'
                      , 'source_img', 'date_published'];

// validate that event obj has all required fields
const validateKeys = (event) => {
  let missingKeys = [];
  expectedKeys.forEach(key => {
    if(!(event[key]))
      missingKeys.push(key);
  });
  
  console.log("THE MISSING KEYS ARRAY IS: ", missingKeys);
  return missingKeys.join(', ');
}

// serialize and sanitize event
const serializeEvent = (event) => {

  try {
    if (!event || !Object.keys(event).length)
      throw new Error('A not empty comment object must be provided');
    
    const missingKeys = validateKeys(event);
    if(missingKeys !== '')
      throw new Error(`Fields ${missingKeys} must be provided`);

    
    return {
      title: xss(event.title),
      categories: xss(event.categories),
      description: xss(event.description),
      event_img: xss(event.event_img),
      source_name: xss(event.source_name),
      source_url: xss(event.source_url),
      source_img: xss(event.source_img),
      date_published: new Date(xss(event.date_published))
    };
  }
  catch (er) {
    console.log('error: ', er);
    return { error: er}
  }
};

// TODO /events/
eventsRouter
  .route('/')
  .get((req, res, next) => {
    /* IMPLEMENT ME */
  })
  .post(jsonParser, (req, res, next) => {
    try {
      let { event } = req.body;
      console.log('the incoming event is: ', event)
      event = serializeEvent(event);

      if(event.error)
        return res.status(400).json({event})

      
      EventsService.addEvent(req.app.get('db'), event)
        .then(addedEvent => {
          res.status(201).json({addedEvent});
        })


        .catch(mainEr => {
          
          try {
            if(mainEr.detail && mainEr.detail.slice(-15) === 'already exists.'){
              console.log('********** DETECTED DUPLICATE VALUE INSERT ATTEMPT **********')
              return EventsService.getEventByTitle(req.app.get('db'), event.title)
                .then(existingEvent => {

                  /*return res.status(400).json({error: {
                    message: 'attempted to insert duplicate',
                    oldEvent: existingEvent,
                    badEvent: event
                  }})*/

                  if(!existingEvent.categories.includes(event.categories)) {
                    existingEvent.categories = existingEvent.categories + ' ' + event.categories;
                    EventsService.updateEventCategories(
                      req.app.get('db')
                      , existingEvent.id 
                      , existingEvent
                    )
                    .then(rowsChanged => {
                      return res.status(200).json({message: 'already exists, categories updated? yes'})
                    })
                    .catch(er => next(er))
                  }
                  else {
                    return res.status(200).json({message: 'already exists, categories updated? no'})
                  }
                })
                .catch(er => next(er))
              
            }
            else {
              return res.status(400).json({'error': {
                mainEr,
                badEvent: event
              }})
              
            }
          }
          catch (er) {
            next(mainEr);
          }


        });
    } 
    catch (er) {
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
    res.json(this.serializeEvent(res.event));
  })
  .delete((req, res, next) => {
    /* IMPLEMENT ME */
  });

module.exports = eventsRouter;
