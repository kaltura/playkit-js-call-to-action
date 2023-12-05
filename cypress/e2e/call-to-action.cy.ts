import {loadPlayerAndSetMedia, getOverlayElement, getPopupElement} from './utils/env';

const assertOverlayDoesntExist = () => getOverlayElement().should('not.exist');
const assertOverlayExists = () => getOverlayElement().should('exist');

describe('call to action plugin', () => {
  describe('message validation', () => {
    describe('message content', () => {
      describe('title', () => {
        it('should not show message if title, description and buttons are not set', () => {
          loadPlayerAndSetMedia({
            messages: [{}]
          }).then(assertOverlayDoesntExist);
        });
      });
      describe('buttons', () => {
        it('should not show message if button label is not set', () => {
          loadPlayerAndSetMedia({
            messages: [{buttons: [{link: 'link'}]}]
          }).then(assertOverlayDoesntExist);
        });
        it('should not show message if button label is not a string', () => {
          loadPlayerAndSetMedia({
            messages: [{buttons: [{link: 'link', label: -1}]}]
          }).then(assertOverlayDoesntExist);
        });
        it('should not show message if button label is an empty string', () => {
          loadPlayerAndSetMedia({
            messages: [{buttons: [{link: 'link', label: ''}]}]
          }).then(assertOverlayDoesntExist);
        });
        it('should not show message if button link is not set', () => {
          loadPlayerAndSetMedia({
            messages: [
              {
                buttons: [{label: 'label'}]
              }
            ]
          }).then(assertOverlayDoesntExist);
        });
        it('should not show message if button link is not a string', () => {
          loadPlayerAndSetMedia({
            messages: [
              {
                buttons: [{label: 'label', link: -1}]
              }
            ]
          }).then(assertOverlayDoesntExist);
        });
        it('should not show message if button link is an empty string', () => {
          loadPlayerAndSetMedia({
            messages: [
              {
                buttons: [{label: 'label', link: ''}]
              }
            ]
          }).then(assertOverlayDoesntExist);
        });
      });
      describe('message timing', () => {
        it('should not show message if timing is undefined', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title'}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if none of the timing fields are set', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if showOnStart is not true', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {showOnStart: false}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if showOnEnd is not true', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {showOnEnd: false}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if timeFromStart is not a number', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {timeFromStart: false}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if timeFromStart is negative', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {timeFromStart: -1}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if timeFromEnd is not a number', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {timeFromEnd: false}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if timeFromEnd is negative', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {timeFromEnd: -1}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if duration is not a number', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {duration: false}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if duration is negative', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {duration: -1}}]}).then(assertOverlayDoesntExist);
        });
        it('should not show message if duration is zero', () => {
          loadPlayerAndSetMedia({messages: [{title: 'title', timing: {duration: 0}}]}).then(assertOverlayDoesntExist);
        });
      });
    });
  });
  // describe('message content', () => {
  //   describe('popup');
  //   describe('overlay');
  // });
  describe('message timing', () => {
    describe('show on start', () => {
      it('should appear on playback start', () => {
        loadPlayerAndSetMedia({messages: [{title: 'title', timing: {showOnStart: true}}]}).then(assertOverlayDoesntExist);
      });
      // it('should disappear when duration expires');
    });
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
});
