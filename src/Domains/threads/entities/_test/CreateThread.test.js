const CreateThread = require('../CreateThread');

describe('an CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    
    const payload = {
      title: 'abc',
      body: 'abc',
    };

   
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      title: 1,
      body: 'abc',
      owner: 'abc',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateThread object correctly', () => {

    const payload = {
      title: 'abc',
      body: 'abc',
      owner: 'abc',
    };

    const { title, body, owner } = new CreateThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
