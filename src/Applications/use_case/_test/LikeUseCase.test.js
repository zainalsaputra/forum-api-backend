const LikeUseCase = require('../LikeUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('LikeUseCase', () => {
  describe('LikeUseCase execute action', () => {
    it('should orchestrating the like action correctly when comment is not liked by user', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockLikeRepository = new LikeRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
      mockLikeRepository.verifyLikeAvailability = jest.fn(() => Promise.resolve(false));
      mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

      /** creating use case instance */
      const likeUseCase = new LikeUseCase({
        likeRepository: mockLikeRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      await likeUseCase.execute(ownerId, threadId, commentId);

      // Assert
      expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(commentId);
      expect(mockLikeRepository.verifyLikeAvailability).toHaveBeenCalledWith(ownerId, commentId);
      expect(mockLikeRepository.addLike).toHaveBeenCalledWith(ownerId, commentId);
    });

    it('should orchestrating the like action correctly when comment is liked by user', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockLikeRepository = new LikeRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
      mockLikeRepository.verifyLikeAvailability = jest.fn(() => Promise.resolve(true));
      mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

      /** creating use case instance */
      const likeUseCase = new LikeUseCase({
        likeRepository: mockLikeRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      await likeUseCase.execute(ownerId, threadId, commentId);

      // Assert
      expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(commentId);
      expect(mockLikeRepository.verifyLikeAvailability).toHaveBeenCalledWith(ownerId, commentId);
      expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(ownerId, commentId);
    });
  });
});