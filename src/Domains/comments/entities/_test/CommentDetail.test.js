const CommentDetail = require('../CommentDetail');

describe('CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      content: 'content',
      likeCount: 0,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrow('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: {},
      content: 'content',
      likeCount: '0',
      replies: 1000,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrow('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });


  it('should create commentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      content: 'content',
      likeCount: 1,
      replies: [],
    };

    // Action
    const {
      id,
      username,
      date,
      content,
      likeCount,
      replies,
    } = new CommentDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies).toEqual(replies);
  });
});
