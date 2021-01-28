const CommentsService = {
  // get all comments
  getComments(db) {
    return db('comments').select('*');
  },
  // get comments with event_id
  getCommentsByEventId(db, event_id, page = 1) {
    // TODO: implement pagination to save resources
    return db('comments')
      .select()
      .where({ event_id })
      .orderBy('date_created', db.raw('asc') );
  },
  // get comments with user_id
  getCommentsByUser(db, user_id) {
    return db('comments').select('*').where('user_id', user_id);
  },
  // add a comment
  addComment(db, comment) {
    return db('comments')
      .insert(comment)
      .returning('*')
      .then(([addedComment]) => addedComment);
  },
  
  /* NOT IN USE */
  // delete comment
  deleteComment(db, id) {
    return db('comments').where({ id }).delete();
  },
  // TODO
  validateContent(content) {
    /* IMPLEMENT ME */
  },
};

module.exports = CommentsService;
