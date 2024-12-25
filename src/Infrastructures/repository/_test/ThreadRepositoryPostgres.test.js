const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const ownerId = 'user-12345';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });

      const addThread = new AddThread({
        title: 'title',
        body: 'body',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread, ownerId);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return addedThread correctly', async () => {
      // Arrange
      const ownerId = 'user-12345';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });

      const addThread = new AddThread({
        title: 'title',
        body: 'body',
      });

      const fakeIdGenerator = () => '321'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread, ownerId);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-321',
        title: 'title',
        owner: ownerId,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread detail correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const ownerId = 'user-12345';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: ownerId,
        createdAt: '2021-08-08T07:19:09.775Z',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(threadDetail).toStrictEqual({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      });
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should return NotFoundError when thread id is invalid', async () => {
      // Arrange
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError when thread id is valid', async () => {
      // Arrange
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: ownerId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
