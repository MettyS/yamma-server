const express = require('express');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
const CommentsService = require('./comments-service');
const EventsService = require('../events/events-service');
const commentsRouter = express.Router();
const jsonParser = express.json();

// HELPER:
const serializeComment = (comment, eventId, userId) => {
  if (!eventId || !userId)
    return res
      .status(400)
      .json({ message: 'An event ID and user ID must be provided' });
  if (!comment || !Object.keys(comment).length)
    return res
      .status(400)
      .json({ message: 'A not empty comment object must be provided' });
  if (!comment.content)
    return res
      .status(400)
      .json({ message : 'Cannot submit a comment with no content' });
  return {
    userId: Number(userId),
    eventId: Number(eventId),
    content: xss(comment.content),
  };
};

// NOTE: having a "/comments/" route isn't useful ATM. All comments are linked to a specific event
//				Client should fetch comments after fetching events
commentsRouter
  .route('/events/:eventId')
    .all((req, res, next) => {
    const { eventId } = req.params;
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
      const comments = await CommentsService.getCommentsByEventId(
        req.app.get('db'),
        req.params.eventId
      );
      if (!comments)
      res.json({ comments });
    } catch (e) {
      next(e);
    }
  })
  .post(requireAuth, jsonParser, async (req, res, next) => {
    try {
      let { comment } = req.body;
      comment = serializeComment(comment, req.params.eventId, req.user.id);
      await CommentsService.addComment(req.app.get('db'), comment);
      res.status(201).json({});
    } catch (e) {
      next(e);
    }
  });

// TODO /comments/:comment_id
commentsRouter
  .route('/id/:commentId')
  .all((req, res, next) => {
    const { comment_id } = req.params;
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
