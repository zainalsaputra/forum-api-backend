const AddThread = require('../../Domains/threads/entities/AddThread');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
const ReplyDetail = require('../../Domains/replies/entities/ReplyDetail');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async addThread(useCasePayload, ownerId) {
    if (!ownerId) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof ownerId !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const addThread = new AddThread(useCasePayload);

    return await this._threadRepository.addThread(addThread, ownerId);
  }

  async getThread(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    await this._threadRepository.verifyThreadAvailability(threadId);
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);
    const likes = await this._likeRepository.getLikesByCommentIds(commentIds);

    const threadComments = comments.map((comment) =>
      new CommentDetail({
        ...comment,
        content: comment.deletedAt ? '**komentar telah dihapus**' : comment.content,
        replies: replies.filter((reply) => comment.id === reply.commentId).map((reply) => {
          return new ReplyDetail({
            ...reply,
            content: reply.deletedAt ? '**balasan telah dihapus**' : reply.content,
          });
        }),
        likeCount: likes.filter((like) => comment.id === like.commentId).length,
      }),
    );

    return new ThreadDetail({
      ...threadDetail,
      comments: threadComments,
    });
  }
}

module.exports = ThreadUseCase;
