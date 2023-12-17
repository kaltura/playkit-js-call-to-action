export const loadPlayer = (pluginConf = {}, playbackConf: Record<string, any> = {}) => {
  cy.visit('index.html');
  return cy.window().then(win => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const kalturaPlayer = win.KalturaPlayer.setup({
        targetId: 'player-placeholder',
        provider: {
          partnerId: -1,
          env: {
            cdnUrl: 'http://mock-cdn',
            serviceUrl: 'http://mock-api'
          }
        },
        plugins: {
          uiManagers: {}
        },
        playback: {muted: true, ...playbackConf}
      });

      kalturaPlayer.configure({plugins: {callToAction: pluginConf}});

      return Promise.resolve(kalturaPlayer);
    } catch (e: any) {
      return Promise.reject(e.message);
    }
  });
};

const defaultSource: any = {
  id: '1234',
  progressive: [
    {
      mimetype: 'video/mp4',
      url: './media/video.mp4'
    }
  ]
};

export const setMedia = (player: any, sessionConfig = {ks: '5678'}, sourcesConfig = defaultSource) => {
  player?.setMedia({
    session: sessionConfig,
    sources: sourcesConfig
  });
};

export const loadPlayerAndSetMedia = (
  pluginConf = {},
  playbackConf: Record<string, any> = {},
  sessionConfig?: any,
  sourcesConfig?: any
): Promise<any> => {
  return new Promise(resolve => {
    loadPlayer(pluginConf, playbackConf).then(kalturaPlayer => {
      setMedia(kalturaPlayer, sessionConfig, sourcesConfig);
      if (playbackConf.autoplay) {
        kalturaPlayer.ready().then(() => resolve(kalturaPlayer));
      }
      resolve(kalturaPlayer);
    });
  });
};

export const getPlayButtonElement = () => cy.get('.playkit-pre-playback-play-button');
export const getOverlayElement = () => cy.get('[data-testid="call-to-action-overlay"]');
export const getPopupElement = () => cy.get('[data-testid="call-to-action-popup"]');

export const expectElementContains = (getElement: () => any, texts: string[]) => {
  for (const text of texts) {
    getElement().contains(text).should('exist');
  }
};
