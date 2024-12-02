const CreatedThread = require('../CreatedThread');

describe('an CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: '123',
      title: '123',
    };

    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    
    const payload = {
      id: 'abc',
      title: 'abc',
      owner: 123,
    };

    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedThread object correctly', () => {

    const payload = {
      id: 'abc',
      title: 'abc',
      owner: 'abc',
    };

    const { id, title, owner } = new CreatedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
