class LikeRepository {
  async toggleCommentLike(userId, commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async countCommentLikes(commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
