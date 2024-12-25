class LikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(ownerId, threadId, commentId) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    const isLiked = await this._likeRepository.verifyLikeAvailability(ownerId, commentId);

    if (isLiked) {
      return this._likeRepository.deleteLike(ownerId, commentId);
    }

    return this._likeRepository.addLike(ownerId, commentId);
  }
};

module.exports = LikeUseCase;
