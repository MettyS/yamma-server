const express = require('express');
const CommentsService = require('./comments-service');
const commentsRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

// HELPER:
const serializeComment = (comment) => {
  /* IMPLEMENT ME */
};

// TODO /comments/
commentsRouter
  .route('/')
  .get((req, res, next) => {
    /* IMPLEMENT ME */
  })
  .post(jsonParser, (req, res, next) => {
    /* IMPLEMENT ME */
  });

// TODO /comments/:comment_id
commentsRouter
  .route('/:comment_id')
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
