import {getOverlayElement, getPlayButtonElement, getPopupElement, loadPlayerAndSetMedia} from './utils/env';

const TITLE = 'title';

const expectElementExistsAt = (pluginConfig: object, time: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getElement()
      .should('exist')
      .then(() => {
        expect(kalturaPlayer.currentTime).to.be.at.least(time);
      });
  });
};

const expectElementDoesntExistAt = (pluginConfig: object, time: number, getElement: () => any) => {
  loadPlayerAndSetMedia(pluginConfig).then(kalturaPlayer => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement()
      .should('not.exist')
      .then(() => {
        getElement()
          .should('not.exist')
          .then(() => {
            expect(kalturaPlayer.currentTime).to.be.at.least(time);
          });
      });
  });
};

const expectPopupExistsAt = (pluginConfig: object, time: number) => {
  expectElementExistsAt(pluginConfig, time, getPopupElement);
};
const expectPopupDoesntExistAt = (pluginConfig: object, time: number) => {
  expectElementDoesntExistAt(pluginConfig, time, getPopupElement);
};
const expectOverlayExistsAt = (pluginConfig: object, time: number) => {
  expectElementExistsAt(pluginConfig, time, getOverlayElement);
};
const expectOverlayDoesntExistAt = (pluginConfig: object, time: number) => {
  expectElementDoesntExistAt(pluginConfig, time, getOverlayElement);
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
      });
      it('should hide message after duration', () => {
        expectPopupDoesntExistAt(
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
  // describe('show on start', () => {
  //   it('should appear on playback start', () => {
  //     loadPlayerAndSetMedia({messages: [{title: 'title', timing: {showOnStart: true}}]}).then(() => expectOverlayExists());
  //   });
  //   // it('should disappear when duration expires');
  // });
  // describe('show on end', () => {
  //   it('should appear on playback end');
  //   it('should disappear when duration expires');
  // });
  // describe('show at time from start', () => {});
  // describe('show at time from end', () => {});
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
