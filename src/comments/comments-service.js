const CommentsService = {
  getComments(db) {
    return db('comments').select('*');
  },
  addComment(db, comment) {
    return db('comments')
      .insert(comment)
      .returning('*')
      .then(([addedComment]) => addedComment);
  },
  deleteComment(db, id) {
    return db('comments').where({ id }).delete();
  },
  getCommentsByUser(db, user_id) {
    return db('comments').select('*').where('user_id', user_id);
  },
  // TODO
  validateContent(content) {
    /* IMPLEMENT ME */
  },
};

module.exports = CommentsService;
