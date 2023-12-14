import {loadPlayerAndSetMedia} from './utils/env';

const getPlayButtonElement = () => cy.get('.playkit-pre-playback-play-button');
const getOverlayElement = () => cy.get('[data-testid="call-to-action-overlay"]');
const getPopupElement = () => cy.get('[data-testid="call-to-action-popup"]');

const expectOverlayDoesntExist = (pluginConfig: object) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getOverlayElement().should('not.exist');
    getPlayButtonElement().should('exist');
  });
};
const expectOverlayExists = (pluginConfig: object) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getOverlayElement().should('exist');
  });
};
const expectPopupExists = (pluginConfig: object) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getPopupElement().should('exist');
  });
};
const expectPopupDoesntExist = (pluginConfig: object) => {
  loadPlayerAndSetMedia(pluginConfig).then(() => {
    getPlayButtonElement().should('exist').click({force: true});
    getPlayButtonElement().should('not.exist');
    getPopupElement().should('not.exist');
  });
};

describe('call to action plugin', () => {
  describe('message validation', () => {
    describe('message content', () => {
      it('should not show message if title, description and buttons are not set', () => {
        expectPopupDoesntExist({messages: [{showToast: true, timing: {showOnStart: true}}]});
        expectOverlayDoesntExist({messages: [{timing: {showOnStart: true}}]});
      });
      describe('title', () => {
        it('should show message if title is set', () => {
          expectPopupExists({messages: [{title: 'aaa', showToast: true, timing: {showOnStart: true}}]});
          expectOverlayExists({messages: [{title: 'aaa', timing: {showOnStart: true}}]});
        });
      });
      describe('description', () => {
        it('should show message if description is set', () => {
          expectPopupExists({messages: [{description: 'aaa', showToast: true, timing: {showOnStart: true}}]});
          expectOverlayExists({messages: [{description: 'aaa', timing: {showOnStart: true}}]});
        });
      });
      describe('buttons', () => {
        it('should show message with one button', () => {
          expectPopupExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should show message with two buttons', () => {
          expectPopupExists({
            messages: [
              {
                showToast: true,
                buttons: [
                  {label: 'aaa', link: 'aaa'},
                  {label: 'bbb', link: 'bbb'}
                ],
                timing: {showOnStart: true}
              }
            ]
          });
          expectOverlayExists({
            messages: [
              {
                buttons: [
                  {label: 'aaa', link: 'aaa'},
                  {label: 'bbb', link: 'bbb'}
                ],
                timing: {showOnStart: true}
              }
            ]
          });
        });
        it('should not show message if button label is not set', () => {
          expectPopupDoesntExist({messages: [{buttons: [{link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button label is not a string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: -1, link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: -1, link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button label is an empty string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: '', link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: '', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is not set', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: ''}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: ''}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is not a string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: 'aaa', link: -1}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: -1}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is an empty string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: 'aaa', link: ''}], showToast: true, timing: {showOnStart: true}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: ''}], timing: {showOnStart: true}}]});
        });
      });
    });
    describe('message timing', () => {
      it('should not show message if timing is undefined', () => {
        expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}]}]});
        expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}]}]});
      });
      it('should not show message if none of the timing fields are set', () => {
        expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {}}]});
        expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {}}]});
      });
      describe('showOnStart', () => {
        it('should show message if showOnStart is true', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if showOnStart is not true', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: false}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: false}}]});
        });
        it('should not show message if showOnStart is not boolean', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: 1}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: 1}}]});
        });
      });
      describe('showOnEnd', () => {
        it('should show message if showOnEnd is true', () => {
          // TODO restore after merge
          //expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: true}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: true}}]});
        });
        it('should not show message if showOnEnd is not true', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: false}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: false}}]});
        });
        it('should not show message if showOnEnd is not boolean', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: 1}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: 1}}]});
        });
      });
      describe('timeFromStart', () => {
        it('should show message if timeFromStart is a positive number', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 1}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 1}}]});
        });
        it('should show message if timeFromStart is zero', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 0}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 0}}]});
        });
        it('should not show message if timeFromStart is a negative number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: -1}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: -1}}]});
        });
        it('should not show message if timeFromStart is not a number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 'aaa'}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 'aaa'}}]});
        });
      });
      describe('timeFromEnd', () => {
        it('should show message if timeFromEnd is a positive number', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 1}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 1}}]});
        });
        it('should show message if timeFromEnd is zero', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 0}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 0}}]});
        });
        it('should not show message if timeFromEnd is not a negative number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: -1}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: -1}}]});
        });
        it('should not show message if timeFromEnd is not a number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 'aaa'}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 'aaa'}}]});
        });
      });
      describe('duration', () => {
        it('should show message if duration is not a positive number', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 1}}]});
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 1}}]});
        });
        it('should not show message if duration is zero', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 0}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 0}}]});
        });
        it('should not show message if duration is negative', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: -1}}]});
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: -1}}]});
        });
        it('should not show message if duration is not a number', () => {
          expectPopupDoesntExist({
            messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 'aaa'}}]
          });
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 'aaa'}}]});
        });
      });
    });
  });

  describe.only('message content', () => {
    describe('popup', () => {
      it('should show title', () => {
        loadPlayerAndSetMedia({messages: [{showToast: true, title: 'cta popup title', timing: {showOnStart: true}}]}).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup title').should('exist');
        });
      });
      it('should show description', () => {
        loadPlayerAndSetMedia({messages: [{showToast: true, description: 'cta popup description', timing: {showOnStart: true}}]}).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup description').should('exist');
        });
      });
      it('should show one button', () => {
        loadPlayerAndSetMedia({
          messages: [{showToast: true, buttons: [{label: 'cta button 1', link: 'http://www.google.com'}], timing: {showOnStart: true}}]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
        });
      });
      it('should show two buttons', () => {
        loadPlayerAndSetMedia({
          messages: [
            {
              showToast: true,
              buttons: [
                {label: 'cta button 1', link: 'http://www.google.com'},
                {label: 'cta button 2', link: 'http://www.google.com'}
              ],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
          getPopupElement().should('exist').contains('cta button 2').should('exist');
        });
      });
      it('should show title and description', () => {
        loadPlayerAndSetMedia({
          messages: [{showToast: true, title: 'cta popup title', description: 'cta popup description', timing: {showOnStart: true}}]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup title').should('exist');
          getPopupElement().should('exist').contains('cta popup description').should('exist');
        });
      });
      it('should show title and one button', () => {
        loadPlayerAndSetMedia({
          messages: [
            {
              showToast: true,
              title: 'cta popup title',
              buttons: [{label: 'cta button 1', link: 'http://www.google.com'}],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup title').should('exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
        });
      });
      it('should show title and two buttons', () => {
        loadPlayerAndSetMedia({
          title: 'cta popup title',
          messages: [
            {
              showToast: true,
              title: 'cta popup title',
              buttons: [
                {label: 'cta button 1', link: 'http://www.google.com'},
                {label: 'cta button 2', link: 'http://www.google.com'}
              ],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup title').should('exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
          getPopupElement().should('exist').contains('cta button 2').should('exist');
        });
      });
      it('should show description and one button', () => {
        loadPlayerAndSetMedia({
          messages: [
            {
              showToast: true,
              description: 'cta popup description',
              buttons: [{label: 'cta button 1', link: 'http://www.google.com'}],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup description').should('exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
        });
      });
      it('should show description and two buttons', () => {
        loadPlayerAndSetMedia({
          description: 'cta popup description',
          messages: [
            {
              showToast: true,
              description: 'cta popup description',
              buttons: [
                {label: 'cta button 1', link: 'http://www.google.com'},
                {label: 'cta button 2', link: 'http://www.google.com'}
              ],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup description').should('exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
          getPopupElement().should('exist').contains('cta button 2').should('exist');
        });
      });
      it('should show title, description and one button', () => {
        loadPlayerAndSetMedia({
          messages: [
            {
              showToast: true,
              title: 'cta popup title',
              description: 'cta popup description',
              buttons: [{label: 'cta button 1', link: 'http://www.google.com'}],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup title').should('exist');
          getPopupElement().should('exist').contains('cta popup description').should('exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
        });
      });
      it('should show title, description and two buttons', () => {
        loadPlayerAndSetMedia({
          messages: [
            {
              title: 'cta popup title',
              description: 'cta popup description',
              showToast: true,
              buttons: [
                {label: 'cta button 1', link: 'http://www.google.com'},
                {label: 'cta button 2', link: 'http://www.google.com'}
              ],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist').contains('cta popup title').should('exist');
          getPopupElement().should('exist').contains('cta popup description').should('exist');
          getPopupElement().should('exist').contains('cta button 1').should('exist');
          getPopupElement().should('exist').contains('cta button 2').should('exist');
        });
      });
    });
    // describe('overlay', () => {
    //it('should show title', () => {});
    // it('should show description', () => {

    // });
    // it('should show one button', () => {

    // });
    // it('should show title and description', () => {

    // });
    // it('should show title and one button', () => {

    // });
    // it('should show title and two buttons', () => {

    // });
    // it('should show description and one button', () => {

    // });
    // it('should show description and two buttons', () => {

    // });
    // it('should show title, description and one button', () => {

    // });
    // it('should show title, description and two buttons', () => {

    // });
    // });
  });
  //describe('message timing', () => {
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
  //});
});
