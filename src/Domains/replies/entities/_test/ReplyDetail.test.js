const ReplyDetail = require('../ReplyDetail');

describe('ReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrow('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: {},
      content: 'content',
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrow('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });


  it('should create replyDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      content: 'content',
    };

    // Action
    const {
      id,
      username,
      date,
      content,
    } = new ReplyDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
