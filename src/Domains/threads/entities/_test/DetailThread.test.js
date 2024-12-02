const DetailThread = require('../DetailThread');
const CommentDetail = require('../../../comments/entities/CommentDetail');

describe('DetailThread entity', () => {
  it('should throw an error when did not contain needed property', () => {
    const payload = {
      title: 'Some Thread Title',
      body: 'Lorem Ipsum Dolor',
      date: '2023-09-21',
      username: 'abc',
    };

    expect(() => new DetailThread(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'Some Thread Title',
      body: 'Lorem Ipsum Dolor',
      date: '2023-09-21',
      username: 'abc',
    };

    const payload2 = {
      id: 'thread-123',
      title: 'Some Thread Title',
      body: 'Lorem Ipsum Dolor',
      date: '2023-09-21',
      username: 'abc',
      comments: [
        {
          id: 'comment-123',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'some comment',
          replies: [],
        },
      ],
    };

    expect(() => new DetailThread(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload2)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return DetailThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Some Thread Title',
      body: 'Lorem Ipsum Dolor',
      date: '2023-09-21',
      username: 'abc',
      comments: [
        new CommentDetail({
          id: 'comment-124',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'some comment',
          replies: [],
        }),
        new CommentDetail({
          id: 'comment-125',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'some comment',
          replies: [],
        }),
      ],
    };

    const {
      id, title, body, date, username, comments,
    } = new DetailThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });

  it('should create DetailThread object correctly when comments is an empty array', () => {
    const payload = {
      id: 'thread-123',
      title: 'Some Thread Title',
      body: 'Lorem Ipsum Dolor',
      date: '2023-09-21',
      username: 'abc',
      comments: [],
    };

    const {
      id, title, body, date, username, comments,
    } = new DetailThread(payload);
    
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toHaveLength(0);
  });
});
