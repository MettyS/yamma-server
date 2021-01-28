const express = require('express');

// middleware
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();

// Service objects
const CommentsService = require('./comments-service');
const EventsService = require('../events/events-service');

// initialize commentsRouter
const commentsRouter = express.Router();


// HELPER:
const serializeComment = (comment, eventId, userId, username) => {
  if (!eventId || !userId || !username)
    return { message: 'An event ID and user ID must be provided' };
  if (!comment || !Object.keys(comment).length)
    return { message: 'A not empty comment object must be provided' };
  if (!comment.content)
    return { message: 'Cannot submit a comment with no content' };
  return {
    user_id: Number(userId),
    event_id: Number(eventId),
    content: xss(comment.content),
    username: xss(username)
  };
};

/* commentsRouter */

// ROUTE /comments/events/:eventId
commentsRouter
  .route('/events/:eventId')
  .all((req, res, next) => {
    const { eventId } = req.params;
    // check if event with id exists
    EventsService.getEventById(req.app.get('db'), eventId)
      .then((event) => {
        if (!event)
          return res.status(404).json({ message: `Event does not exist` });
        next();
      })
      .catch(next);
  })
  //get all comments for a given event by event ID => returns { comments: [...comments]}
  // TODO: implement query usage to enable pagination with service
  .get(async (req, res, next) => {
    try {
      // get comments with eventId
      const comments = await CommentsService.getCommentsByEventId(
        req.app.get('db'),
        req.params.eventId
      );
      // send comments
			res.json({ comments });
    } catch (e) {
      // if error, send error
      res.status(400).json({error: e })
      next(e);
    }
  })
  .post(requireAuth, jsonParser, async (req, res, next) => {
    try {
      let { comment } = req.body;
      // serialize and sanitize comment
      comment = serializeComment(comment, req.params.eventId, req.user.id, req.user.username);

      // if there was an issue during serializing, send response
      if(comment.message) {
        return res
        .status(400)
        .json( comment )
      }

      // create and add comment
      const newComment = await CommentsService.addComment(req.app.get('db'), comment);
      res.status(201).json(newComment);
    } catch (e) {
      next(e);
    }
  });

// ROUTE /comments/id/:comment_id
commentsRouter
  .route('/id/:commentId')
  .all((req, res, next) => {
    const { comment_id } = req.params;
    // get comment with id
    CommentsService.getCommentById(req.app.get('db'), comment_id)
      .then((commentWithId) => {
        if (!commentWithId)
          return res.status(404).json({ message: `Comment does not exist` });

        req.comment = commentWithId;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(this.serializeComment(res.comment));
  })
  .delete((req, res, next) => {
    /* IMPLEMENT ME */
  });

module.exports = commentsRouter;
