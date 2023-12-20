import {getOverlayElement, getPlayButtonElement, getPopupElement, loadPlayerAndSetMedia} from './utils/env';

const TITLE = 'title';
const EXECUTION_TIME_MARGIN = 100;

const expectElementExistsAt = (pluginConfig: object, expectedStartTime: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => getElement().should('exist'))
      .then(() => expect(kalturaPlayer.currentTime).to.be.at.least(expectedStartTime));
  });
};

const expectElementDoesntExistAfter = (pluginConfig: object, expectedStartTime: number, expectedDuration: number, getElement: () => any) => {
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

const expectPopupExistsAt = (pluginConfig: object, expectedStartTime: number) => {
  expectElementExistsAt(pluginConfig, expectedStartTime, getPopupElement);
};
const expectPopupDoesntExistAfter = (pluginConfig: object, expectedStartTime: number, expectedDuration: number) => {
  expectElementDoesntExistAfter(pluginConfig, expectedStartTime, expectedDuration, getPopupElement);
};
const expectOverlayExistsAt = (pluginConfig: object, expectedStartTime: number) => {
  expectElementExistsAt(pluginConfig, expectedStartTime, getOverlayElement);
};
const expectOverlayDoesntExistAfter = (pluginConfig: object, expectedStartTime: number, expectedDuration: number) => {
  expectElementDoesntExistAfter(pluginConfig, expectedStartTime, expectedDuration, getOverlayElement);
};

describe('message timing', () => {
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
          0,
          2
        );
        expectOverlayDoesntExistAfter(
          {
            messages: [
              {
                title: TITLE,
                timing: {showOnStart: true, duration: 2}
              }
            ]
          },
          0,
          2
        );
      });
    });
    describe('show on end', () => {
      it('should display message on playback end', () => {
        expectPopupExistsAt(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {showOnEnd: true}
              }
            ]
          },
          4
        );
        expectOverlayExistsAt(
          {
            messages: [
              {
                title: TITLE,
                timing: {showOnEnd: true}
              }
            ]
          },
          4
        );
      });
      it('should hide message after duration', () => {
        expectPopupDoesntExistAfter(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {showOnEnd: true, duration: 2}
              }
            ]
          },
          4,
          2
        );
        expectOverlayDoesntExistAfter(
          {
            messages: [
              {
                title: TITLE,
                timing: {showOnEnd: true, duration: 2}
              }
            ]
          },
          4,
          2
        );
      });
    });
    describe('time from start', () => {
      it('should display message on time from start', () => {
        expectPopupExistsAt(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {timeFromStart: 1}
              }
            ]
          },
          1
        );
        expectOverlayExistsAt(
          {
            messages: [
              {
                title: TITLE,
                timing: {timeFromStart: 1}
              }
            ]
          },
          1
        );
      });
      it('should hide message after duration', () => {
        expectPopupDoesntExistAfter(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {timeFromStart: 1, duration: 2}
              }
            ]
          },
          1,
          2
        );
        expectOverlayDoesntExistAfter(
          {
            messages: [
              {
                title: TITLE,
                timing: {timeFromStart: 1, duration: 2}
              }
            ]
          },
          1,
          2
        );
      });
    });
    describe('time from end', () => {
      it('should display message on time from end', () => {
        expectPopupExistsAt(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {timeFromEnd: 2}
              }
            ]
          },
          2
        );
        expectOverlayExistsAt(
          {
            messages: [
              {
                title: TITLE,
                timing: {timeFromEnd: 2}
              }
            ]
          },
          2
        );
      });
      it('should hide message after duration', () => {
        expectPopupDoesntExistAfter(
          {
            messages: [
              {
                showToast: true,
                title: TITLE,
                timing: {timeFromEnd: 3, duration: 2}
              }
            ]
          },
          1,
          2
        );
        expectOverlayDoesntExistAfter(
          {
            messages: [
              {
                title: TITLE,
                timing: {timeFromEnd: 3, duration: 2}
              }
            ]
          },
          1,
          2
        );
      });
    });
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
