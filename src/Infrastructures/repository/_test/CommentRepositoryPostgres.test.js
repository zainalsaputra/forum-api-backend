const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    const threadId = 'thread-123';
    const ownerId = 'user-123';
    await UsersTableTestHelper.addUser({ id: ownerId, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment to database', async () => {
      // Arrange
      const ownerId = 'user-123';
      const threadId = 'thread-123';

      const addComment = new AddComment({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment, ownerId, threadId);

      // Assert
      const findCommentById = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(findCommentById).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const ownerId = 'user-123';
      const threadId = 'thread-123';

      const addComment = new AddComment({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addCommentRepository = await commentRepositoryPostgres.addComment(addComment, ownerId, threadId);

      // Assert
      expect(addCommentRepository).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments array correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const ownerId = 'user-123';
      await CommentsTableTestHelper.addComments({
        id: commentId,
        owner: ownerId,
        threadId,
        createdAt: '2024-08-08T07:19:09.775Z',
        content: 'content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const getCommentsByThreadId = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(getCommentsByThreadId).toStrictEqual([{
        id: 'comment-123',
        username: 'dicoding',
        date: '2024-08-08T07:19:09.775Z',
        content: 'content',
        deletedAt: null
      }]);
    });
  });

  describe('deleteCommentById function', () => {
    it('should modify deleted_at attribute of comment', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComments({ commentId: commentId, owner: ownerId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const findCommentById = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(findCommentById.deleted_at).not.toBeNull();
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not comment owner', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComments({ commentId, owner: ownerId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is comment owner', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComments({ commentId, owner: ownerId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should return NotFoundError when comment id is invalid', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError when comment id is valid', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComments({ id: commentId, owner: ownerId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
