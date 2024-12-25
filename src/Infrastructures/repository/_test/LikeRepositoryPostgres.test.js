const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';
    await UsersTableTestHelper.addUser({ id: ownerId, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
    await CommentsTableTestHelper.addComments({ id: commentId, owner: ownerId });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add like to database', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(ownerId, commentId);

      // Assert
      const findLikeById = await LikesTableTestHelper.findLikeById('like-123');
      expect(findLikeById).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      // Arrange
      const id = 'like-123';
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action
      await likeRepositoryPostgres.deleteLike(ownerId, commentId);
      const findLikeById = await LikesTableTestHelper.findLikeById(id);

      // Assert
      expect(findLikeById).toHaveLength(0);
    });
  });

  describe('verifyLikeAvailability function', () => {
    it('should return true if like is available', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action
      const verifyLikeAvailability = await likeRepositoryPostgres.verifyLikeAvailability(ownerId, commentId);

      // Assert
      expect(verifyLikeAvailability).toEqual(true);
    });

    it('should return false if like is unavailable', async () => {
      // Arrange
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const verifyLikeAvailability = await likeRepositoryPostgres.verifyLikeAvailability(ownerId, commentId);

      // Assert
      expect(verifyLikeAvailability).toEqual(false);
    });
  });

  describe('getLikesByCommentIds function', () => {
    it('should return likes array correctly', async () => {
      // Arrange
      const id = 'like-123';
      const commentId = 'comment-123';
      const ownerId = 'user-123';
      const commentIds = ['comment-123'];

      await LikesTableTestHelper.addLike({
        id,
        owner: ownerId,
        commentId,
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likes = await likeRepositoryPostgres.getLikesByCommentIds(commentIds);

      // Assert
      expect(likes).toStrictEqual([{
        id: 'like-123',
        commentId: 'comment-123',
      }]);
    });
  });
});
