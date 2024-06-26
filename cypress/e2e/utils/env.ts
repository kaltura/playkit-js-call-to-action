const EXECUTION_TIME_MARGIN = 100;

const defaultSource: any = {
  id: '1234',
  progressive: [
    {
      mimetype: 'video/mp4',
      url: './media/video.mp4'
    }
  ]
};

const loadPlayer = (pluginConf = {}, playbackConf: Record<string, any> = {}) => {
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

const setMedia = (player: any, sessionConfig = {ks: '5678'}, sourcesConfig = defaultSource) => {
  player?.setMedia({
    session: sessionConfig,
    sources: sourcesConfig
  });
};

const loadPlayerAndSetMedia = (pluginConf = {}, playbackConf: Record<string, any> = {}, sessionConfig?: any, sourcesConfig?: any): Promise<any> => {
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

const getPlayButtonElement = () => cy.get('.playkit-pre-playback-play-button');

export const expectContains = (pluginConfig: any, texts: string[], getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    for (const text of texts) {
      getElement().contains(text).should('exist');
    }
  });
};

export const expectCloseButton = (pluginConfig: any, getCloseButton: () => any, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getElement().should('exist');
    getCloseButton().click({force: true});
    getElement().should('not.exist');
  });
};

export const expectWindowOpen = (pluginConfig: any, buttonLabel: string, buttonLink: string, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    cy.window().then(win => {
      cy.stub(win, 'open').as('Open');
    });

    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getElement().contains(buttonLabel).click({force: true});
    cy.get('@Open').should('have.been.calledOnceWith', buttonLink, '_blank');
  });
};

export const expectLoadMedia = (pluginConfig: any, buttonLabel: string, buttonLink: string, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    cy.stub(kalturaPlayer, 'loadMedia').as('LoadMedia');
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getElement().contains(buttonLabel).click({force: true});
    cy.get('@LoadMedia').should('have.been.calledOnceWith', {entryId: buttonLink});
  });
};

export const expectElementExists = (pluginConfig: object, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'));
  });
};

export const expectElementDoesntExist = (pluginConfig: object, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('not.exist'));
  });
};

export const expectElementExistsAt = (pluginConfig: object, expectedStartTime: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => expect(kalturaPlayer.currentTime).to.be.at.least(expectedStartTime));
  });
};

export const expectElementDoesntExistAfter = (pluginConfig: object, expectedStartTime: number, expectedDuration: number, getElement: () => any) => {
  let startTimeDelta = 0;
  let timestampOnStart = 0;
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => {
        return getElement().should('exist');
      })
      .then(() => {
        timestampOnStart = Date.now();
        startTimeDelta = kalturaPlayer.currentTime - expectedStartTime;
        return getElement().should('not.exist');
      })
      .then(() => expect(Date.now() - timestampOnStart + EXECUTION_TIME_MARGIN).to.be.at.least(1000 * (expectedDuration - startTimeDelta)));
  });
};

export const expectElementExistsAfterSeek = (pluginConfig: object, seekTo: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => getElement().should('not.exist'))
      .then(() => {
        kalturaPlayer.currentTime = seekTo;
        return getElement().should('exist');
      });
  });
};

export const expectElementExistsAfterCloseAndSeek = (pluginConfig: object, seekTo: number, getCloseButton: () => any, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => getCloseButton().click({force: true}))
      .then(() => getElement().should('not.exist'))
      .then(() => {
        kalturaPlayer.currentTime = 0;
        return getElement().should('exist');
      });
  });
};

export const expectElementDoesntExistAfterCloseAndSeek = (pluginConfig: object, seekTo: number, getCloseButton: () => any, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => getCloseButton().click({force: true}))
      .then(() => getElement().should('not.exist'))
      .then(() => {
        kalturaPlayer.currentTime = seekTo;
        return getElement().should('not.exist');
      });
  });
};

export const expectElementExistsForTimeAfterSeek = (pluginConfig: object, seekTo: number, maxDuration: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    let startTimeStamp = 0;
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => getElement().should('not.exist'))
      .then(() => {
        kalturaPlayer.currentTime = seekTo;
        return getElement().should('exist');
      })
      .then(() => {
        startTimeStamp = Date.now();
        return getElement().should('not.exist');
      })
      .then(() => {
        expect(Date.now() - startTimeStamp).to.be.lessThan(maxDuration * 1000);
      });
  });
};

export const expectElementsInOrder = (pluginConfig: object, messages: {messageStartTime?: number; messageText: string}[], getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => {
        return messages.reduce((chain: any, message) => {
          return chain.then(() => {
            return getElement().contains(message.messageText).should('exist');
          });
        }, Promise.resolve());
      });
  });
};
