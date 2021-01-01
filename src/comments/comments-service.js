const CommentsService = {
  getComments(db) {
    return db('comments').select('*');
  },
  getCommentsByEventId(db, event_id, page = 1) {
    // TODO: implement pagination to save resources
    return db('comments')
      .select()
      .where({ event_id })
      .orderBy({ column: 'date_created', order: 'asc' });
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
