import {getOverlayElement, getPlayButtonElement, getPopupElement, loadPlayerAndSetMedia} from './utils/env';

const TITLE = 'title';

const expectElementExistsAt = (pluginConfig: object, time: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => expect(kalturaPlayer.currentTime).to.be.at.least(time));
  });
};

const expectElementDoesntExistAfter = (pluginConfig: object, expectedDurationInSeconds: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    let messageStartTime = 0;
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => {
        messageStartTime = Date.now();
        return getElement().should('not.exist');
      })
      .then(() => expect(Date.now() - messageStartTime).to.be.at.least(expectedDurationInSeconds * 1000));
    // getPlayButtonElement()
    //   .should('not.exist')
    //   .then(() => {
    //     getElement()
    //       .should('exist')
    //       .then(() => {
    //         getElement()
    //           .should('not.exist')
    //           .then(() => {
    //             // debugger;
    //             expect(kalturaPlayer.currentTime).to.be.at.least(time);
    //           });
    //       });
    //   });
  });
};

const expectPopupExistsAt = (pluginConfig: object, time: number) => {
  expectElementExistsAt(pluginConfig, time, getPopupElement);
};
const expectPopupDoesntExistAfter = (pluginConfig: object, time: number) => {
  expectElementDoesntExistAfter(pluginConfig, time, getPopupElement);
};
const expectOverlayExistsAt = (pluginConfig: object, time: number) => {
  expectElementExistsAt(pluginConfig, time, getOverlayElement);
};
const expectOverlayDoesntExistAfter = (pluginConfig: object, time: number) => {
  expectElementDoesntExistAfter(pluginConfig, time, getOverlayElement);
};

describe.only('message timing', () => {
  describe('start time and duration', () => {
    describe('show on start', () => {
      it('should display message on playback start', () => {
        expectPopupExistsAt(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {showOnStart: true}
              }
            ]
          },
          0
        );
        expectOverlayExistsAt(
          {
            messages: [
              {
                title: TITLE,
                timing: {showOnStart: true}
              }
            ]
          },
          0
        );
      });
      it('should hide message after duration', () => {
        expectPopupDoesntExistAfter(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {showOnStart: true, duration: 2}
              }
            ]
          },
          2
        );
      });
    });
    // describe('show on end', () => {

    // });
    // describe('time from start', () => {

    // });
    // describe('time from end', () => {

    // });
  });
  //describe('seeked event');
  // message ended normally
  // message was closed and redisplay is false
  // message was closed and redisplay is true
  // seek into a message range
  // message has duration
  // message has no duration
  // describe('multiple messages', () => {
  //   describe('one message on start, the other at time from start');
  //   describe('one message on start, the other at time from end');
  //   describe('one message on start, the other on end');
  //   describe('two messages at time from start');
  //   describe('one at time from start, the other at time from end');
  //   describe('two messages at time from end');
  //   describe('one message on end, the other at time from start');
  //   describe('one message on end, the other at time from end');
  // });
});
