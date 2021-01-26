const commentsFixture = {
  validComments: require('./comments.json'),
  newComment: (user_id, event_id, username) => {
    return {
      user_id,
      event_id,
      username,
      comment: {
        content: `new comment by user ${user_id}`,
      }
    };
  },
};

module.exports = commentsFixture;
