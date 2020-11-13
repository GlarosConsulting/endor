import CreateLiveLinkService from './CreateLiveLinkService';

let createLive: CreateLiveLinkService;

describe('CreateLiveLink', () => {
  beforeEach(() => {
    createLive = new CreateLiveLinkService();
  });

  it('should be able to create live link', async () => {
    const live_url = await createLive.execute(
      'rtsp://teste:teste123456@grupoendor.ddns.net:554/cam/realmonitor?channel=1&subtype=0',
    );

    expect.stringContaining(live_url);
  });
});
