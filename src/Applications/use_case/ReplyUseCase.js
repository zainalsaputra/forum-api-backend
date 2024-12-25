const AddReply = require('../../Domains/replies/entities/AddReply');

class ReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addReply(useCasePayload, ownerId, threadId, commentId) {
    if (!ownerId || !commentId) {
      throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof ownerId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    const addReply = new AddReply(useCasePayload);

    return this._replyRepository.addReply(addReply, ownerId, commentId);
  }

  async deleteReply(replyId, userId) {
    if (!replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    await this._replyRepository.verifyReplyAvailability(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = ReplyUseCase;
