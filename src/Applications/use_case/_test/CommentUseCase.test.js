const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentUseCase = require('../CommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CommentUseCase', () => {
  describe('CommentUseCase addComment action', () => {
    it('should throw error if addComment not contain needed parameter', async () => {
      // Arrange
      const useCasePayload = {};
      const commentUseCase = new CommentUseCase({});

      // Action & Assert
      await expect(commentUseCase.addComment(useCasePayload, null, null))
        .rejects
        .toThrow('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    });

    it('should throw error when addComment parameter did not meet data type specification', async () => {
      // Arrange
      const commentUseCase = new CommentUseCase({});

      // Action & Assert
      await expect(commentUseCase.addComment(123, true, 321))
        .rejects
        .toThrow('ADD_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
      };

      const ownerId = 'user-123';
      const threadId = 'thread-123';

      const mockAddedComment = new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: ownerId,
      });

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedComment = await commentUseCase.addComment(useCasePayload, ownerId, threadId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      }));

      expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
      expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
        new AddComment({
          content: 'content',
        }),
        'user-123',
        'thread-123',
      );
    });
  });

  describe('CommentUseCase deleteComment action', () => {
    it('should throw error if deleteComment not contain needed parameter', async () => {
      // Arrange
      const commentUseCase = new CommentUseCase({});

      // Action & Assert
      await expect(commentUseCase.deleteComment())
        .rejects
        .toThrow('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    });

    it('should throw error when deleteComment parameter did not meet data type specification', async () => {
      // Arrange
      const commentUseCase = new CommentUseCase({});

      // Action & Assert
      await expect(commentUseCase.deleteComment(true, 321))
        .rejects
        .toThrow('DELETE_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete comment action correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
      mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: {},
      });

      // Action
      await commentUseCase.deleteComment(commentId, userId);

      // Assert
      expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(commentId);
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(commentId, userId);
      expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(commentId);
    });
  });
});
