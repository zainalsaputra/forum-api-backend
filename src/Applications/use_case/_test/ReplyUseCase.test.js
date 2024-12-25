const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyUseCase = require('../ReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ReplyUseCase', () => {
  describe('ReplyUseCase addReply action', () => {
    it('should throw error if addReply not contain needed parameter', async () => {
      // Arrange
      const useCasePayload = {};
      const replyUseCase = new ReplyUseCase({});

      // Action & Assert
      await expect(replyUseCase.addReply(useCasePayload, null, null, null))
        .rejects
        .toThrow('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    });

    it('should throw error when addReply parameter did not meet data type specification', async () => {
      // Arrange
      const replyUseCase = new ReplyUseCase({});

      // Action & Assert
      await expect(replyUseCase.addReply(123, true, 321, true))
        .rejects
        .toThrow('ADD_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrate the add reply action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
      };

      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const mockAddedReply = {
        id: 'reply-123',
        content: useCasePayload.content,
        owner: ownerId,
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
      mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockAddedReply));

      /** creating use case instance */
      const replyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const addedReply = await replyUseCase.addReply(
        useCasePayload,
        ownerId,
        threadId,
        commentId
      );

      // Assert
      expect(addedReply).toStrictEqual({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
      });

      expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
      expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
      expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
        new AddReply({
          content: 'content',
        }),
        'user-123',
        'comment-123',
      );
    });
  });

  describe('ReplyUseCase deleteReply action', () => {
    it('should throw error if deleteReply not contain needed parameter', async () => {
      // Arrange
      const replyUseCase = new ReplyUseCase({});

      // Action & Assert
      await expect(replyUseCase.deleteReply())
        .rejects
        .toThrow('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    });

    it('should throw error when deleteReply parameter did not meet data type specification', async () => {
      // Arrange
      const replyUseCase = new ReplyUseCase({});

      // Action & Assert
      await expect(replyUseCase.deleteReply(true, 321))
        .rejects
        .toThrow('DELETE_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrate the delete reply action correctly', async () => {
      // Arrange
      const replyId = 'reply-123';
      const userId = 'user-123';

      /** creating dependency of use case */
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockReplyRepository.verifyReplyAvailability = jest.fn(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
      mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

      /** creating use case instance */
      const replyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: {},
        commentRepository: {},
      });

      // Action
      await replyUseCase.deleteReply(replyId, userId);

      // Assert
      expect(mockReplyRepository.verifyReplyAvailability).toHaveBeenCalledWith(replyId);
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(replyId, userId);
      expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(replyId);
    });
  });
});
