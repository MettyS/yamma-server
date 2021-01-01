const express = require('express');
const CommentsService = require('./comments-service');
const commentsRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

// HELPER:
const serializeComment = (comment) => {
  /* IMPLEMENT ME */
};

// NOTE: having a "/comments/" route isn't useful ATM. All comments are linked to a specific event
//				Client should fetch comments after fetching events
commentsRouter
  .route('/events/:eventId')
	//get all comments for a given event by eventId => returns { comments: [...comments]}
  .get( async (req, res, next) => {
    try {
			const comments = await CommentsService.getCommentsByEventId(
				req.app.get('db'),
				req.params.eventId
			);
			res.json({ comments });
		} catch (e) {
			next(e);
		}
  })
  .post(jsonParser, (req, res, next) => {
    /* IMPLEMENT ME */
  });

// TODO /comments/:comment_id
commentsRouter
  .route('/id/:commentId')
  .all((req, res, next) => {
    const { comment_id } = req.params;
    CommentsService.getCommentById(req.app.get('db'), comment_id)
      .then((commentWithId) => {
        if (!commentWithId)
          return res
            .status(404)
            .json({ error: { message: `Comment does not exist` } });

        res.comment = commentWithId;
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
