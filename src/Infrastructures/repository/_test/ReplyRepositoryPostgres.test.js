const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';
    await UsersTableTestHelper.addUser({ id: ownerId, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
    await CommentsTableTestHelper.addComments({ id: commentId, owner: ownerId });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add reply to database', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      const addReply = new AddReply({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(addReply, ownerId, commentId);

      // Assert
      const findReplyById = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(findReplyById).toHaveLength(1);
    });

    it('should return addedReply correctly', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      const addReply = new AddReply({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply, ownerId, commentId);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
      }));
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return replies array correctly', async () => {
      // Arrange
      const replyId = 'reply-123';
      const commentId = 'comment-123';
      const ownerId = 'user-123';
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: ownerId,
        commentId,
        createdAt: '2024-08-08T07:19:09.775Z',
        content: 'content',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});


      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123']);

      // Assert
      expect(replies).toStrictEqual([{
        id: 'reply-123',
        username: 'dicoding',
        commentId: 'comment-123',
        date: '2024-08-08T07:19:09.775Z',
        content: 'content',
        deletedAt: null
      }]);
    });
  });

  describe('deleteReplyById function', () => {
    it('should modify deleted_at attribute of reply', async () => {
      // Arrange
      const ownerId = 'user-123';
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ replyId, owner: ownerId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply.deleted_at).not.toBeNull();
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when user is not reply owner', async () => {
      // Arrange
      const ownerId = 'user-123';
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ replyId, owner: ownerId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-321'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is reply owner', async () => {
      // Arrange
      const ownerId = 'user-123';
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ replyId, owner: ownerId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should return NotFoundError when reply id is invalid', async () => {
      // Arrange
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability(replyId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError when reply id is valid', async () => {
      // Arrange
      const ownerId = 'user-123';
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ id: replyId, owner: ownerId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability(replyId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
