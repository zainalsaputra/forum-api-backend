const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeUseCase = this._container.getInstance(LikeUseCase.name);

    await likeUseCase.execute(
      ownerId,
      threadId,
      commentId
    );

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
