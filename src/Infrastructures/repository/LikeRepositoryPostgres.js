const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(ownerId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [
        id,
        ownerId,
        commentId,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteLike(ownerId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [
        ownerId,
        commentId,
      ],
    };

    await this._pool.query(query);
  }

  async verifyLikeAvailability(ownerId, commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [
        ownerId,
        commentId,
      ],
    };

    const result = await this._pool.query(query);
    return result.rowCount ? true : false;
  }

  async getLikesByCommentIds(commentIds) {
    const query = {
      text: 'SELECT id, comment_id AS "commentId" FROM likes WHERE likes.comment_id = ANY($1::text[])',
      values: [commentIds] //commentIds bertipe array string
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
};

module.exports = LikeRepositoryPostgres;
