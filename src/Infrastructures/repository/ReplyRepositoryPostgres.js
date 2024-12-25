const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply, ownerId, commentId) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [
        id,
        content,
        ownerId,
        commentId,
        createdAt,
        null
      ],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: 'SELECT replies.id, users.username, comment_id AS "commentId", replies.created_at AS date, content, replies.deleted_at AS "deletedAt" FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.comment_id = ANY($1::text[]) ORDER BY replies.created_at',
      values: [commentIds] //commentIds bertipe array string
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReplyById(replyId) {
    const timestamp = new Date().toISOString();

    const query = {
      text: 'UPDATE replies SET deleted_at = $1 WHERE id = $2 RETURNING id',
      values: [
        timestamp,
        replyId,
      ],
    };

    await this._pool.query(query);
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    const reply = result.rows[0];
    if (reply.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyReplyAvailability(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
