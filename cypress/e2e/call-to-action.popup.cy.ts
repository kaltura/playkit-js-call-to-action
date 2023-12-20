import {
  expectCloseButton,
  expectContains,
  expectElementDoesntExist,
  expectElementDoesntExistAfter,
  expectElementExists,
  expectElementExistsAt,
  expectLoadMedia,
  expectWindowOpen
} from './utils/env';

const TITLE = 'cta title';
const DESCRIPTION = 'cta description';
const BUTTON_1_LABEL = 'cta button 1';
const BUTTON_2_LABEL = 'cta button 2';
const BUTTON_LINK_URL = 'http://www.google.com';
const BUTTON_LINK_ENTRY = 'test';

const getPopupElement = () => cy.get('[data-testid="call-to-action-popup"]');
const getCloseButton = () => cy.get('[data-testid="call-to-action-popup-close-button"] button');

const expectContainsInPopup = (pluginConfig: any, texts: string[]) => expectContains(pluginConfig, texts, getPopupElement);
const expectCloseButtonInPopup = (pluginConfig: any) => {
  expectCloseButton(pluginConfig, getCloseButton, getPopupElement);
};
const expectWindowOpenInPopup = (pluginConfig: any, buttonLabel: string, buttonLink: string) => {
  expectWindowOpen(pluginConfig, buttonLabel, buttonLink, getPopupElement);
};
const expectLoadMediaInPopup = (pluginConfig: any, buttonLabel: string, buttonLink: string) =>
  expectLoadMedia(pluginConfig, buttonLabel, buttonLink, getPopupElement);

const expectPopupExists = (pluginConfig: object) => {
  expectElementExists(pluginConfig, getPopupElement);
};
const expectPopupDoesntExist = (pluginConfig: object) => {
  expectElementDoesntExist(pluginConfig, getPopupElement);
};
const expectPopupExistsAt = (pluginConfig: object, expectedStartTime: number) => {
  expectElementExistsAt(pluginConfig, expectedStartTime, getPopupElement);
};
const expectPopupDoesntExistAfter = (pluginConfig: object, expectedStartTime: number, expectedDuration: number) => {
  expectElementDoesntExistAfter(pluginConfig, expectedStartTime, expectedDuration, getPopupElement);
};

describe('call to action popup', () => {
  describe('message validation', () => {
    describe('message content', () => {
      it('should not show message if title, description and buttons are not set', () => {
        expectPopupDoesntExist({messages: [{showToast: true, timing: {showOnStart: true}}]});
      });
      describe('title', () => {
        it('should show message if title is set', () => {
          expectPopupExists({messages: [{title: 'aaa', showToast: true, timing: {showOnStart: true}}]});
        });
      });
      describe('description', () => {
        it('should show message if description is set', () => {
          expectPopupExists({messages: [{description: 'aaa', showToast: true, timing: {showOnStart: true}}]});
        });
      });
      describe('buttons', () => {
        it('should show message with one button', () => {
          expectPopupExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
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
        });
        it('should not show message if button label is not set', () => {
          expectPopupDoesntExist({messages: [{buttons: [{link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
        });
        it('should not show message if button label is not a string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: -1, link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
        });
        it('should not show message if button label is an empty string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: '', link: 'aaa'}], showToast: true, timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is not set', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: ''}], showToast: true, timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is not a string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: 'aaa', link: -1}], showToast: true, timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is an empty string', () => {
          expectPopupDoesntExist({messages: [{buttons: [{label: 'aaa', link: ''}], showToast: true, timing: {showOnStart: true}}]});
        });
      });
    });
    describe('message timing', () => {
      it('should not show message if timing is undefined', () => {
        expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}]}]});
      });
      it('should not show message if none of the timing fields are set', () => {
        expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {}}]});
      });
      describe('showOnStart', () => {
        it('should show message if showOnStart is true', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if showOnStart is not true', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: false}}]});
        });
        it('should not show message if showOnStart is not boolean', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: 1}}]});
        });
      });
      describe('showOnEnd', () => {
        it('should show message if showOnEnd is true', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: true}}]});
        });
        it('should not show message if showOnEnd is not true', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: false}}]});
        });
        it('should not show message if showOnEnd is not boolean', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: 1}}]});
        });
      });
      describe('timeFromStart', () => {
        it('should show message if timeFromStart is a positive number', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 1}}]});
        });
        it('should show message if timeFromStart is zero', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 0}}]});
        });
        it('should not show message if timeFromStart is a negative number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: -1}}]});
        });
        it('should not show message if timeFromStart is not a number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 'aaa'}}]});
        });
      });
      describe('timeFromEnd', () => {
        it('should show message if timeFromEnd is a positive number', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 1}}]});
        });
        it('should show message if timeFromEnd is zero', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 0}}]});
        });
        it('should not show message if timeFromEnd is not a negative number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: -1}}]});
        });
        it('should not show message if timeFromEnd is not a number', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 'aaa'}}]});
        });
      });
      describe('duration', () => {
        it('should show message if duration is not a positive number', () => {
          expectPopupExists({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 1}}]});
        });
        it('should not show message if duration is zero', () => {
          expectPopupDoesntExist({messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 0}}]});
        });
        it('should not show message if duration is negative', () => {
          expectPopupDoesntExist({
            messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: -1}}]
          });
        });
        it('should not show message if duration is not a number', () => {
          expectPopupDoesntExist({
            messages: [{showToast: true, buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 'aaa'}}]
          });
        });
      });
    });
  });
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
  describe('popup content', () => {
    it('should show title', () => {
      expectContainsInPopup({messages: [{showToast: true, title: TITLE, timing: {showOnStart: true}}]}, [TITLE]);
    });
    it('should show description', () => {
      expectContainsInPopup({messages: [{showToast: true, description: DESCRIPTION, timing: {showOnStart: true}}]}, [DESCRIPTION]);
    });
    it('should show one button', () => {
      expectContainsInPopup(
        {
          messages: [{showToast: true, buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}], timing: {showOnStart: true}}]
        },
        [BUTTON_1_LABEL]
      );
    });
    it('should show two buttons', () => {
      expectContainsInPopup(
        {
          messages: [
            {
              showToast: true,
              buttons: [
                {label: BUTTON_1_LABEL, link: BUTTON_LINK_URL},
                {label: BUTTON_2_LABEL, link: BUTTON_LINK_ENTRY}
              ],
              timing: {showOnStart: true}
            }
          ]
        },
        [BUTTON_1_LABEL, BUTTON_2_LABEL]
      );
    });
    it('should show title and description', () => {
      expectContainsInPopup(
        {
          messages: [{showToast: true, title: TITLE, description: DESCRIPTION, timing: {showOnStart: true}}]
        },
        [TITLE, DESCRIPTION]
      );
    });
    it('should show title and one button', () => {
      expectContainsInPopup(
        {
          messages: [
            {
              showToast: true,
              title: TITLE,
              buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}],
              timing: {showOnStart: true}
            }
          ]
        },
        [TITLE, BUTTON_1_LABEL]
      );
    });
    it('should show title and two buttons', () => {
      expectContainsInPopup(
        {
          title: 'cta title',
          messages: [
            {
              showToast: true,
              title: 'cta title',
              buttons: [
                {label: BUTTON_1_LABEL, link: BUTTON_LINK_URL},
                {label: BUTTON_2_LABEL, link: BUTTON_LINK_ENTRY}
              ],
              timing: {showOnStart: true}
            }
          ]
        },
        [TITLE, BUTTON_1_LABEL, BUTTON_2_LABEL]
      );
    });
    it('should show description and one button', () => {
      expectContainsInPopup(
        {
          messages: [
            {
              showToast: true,
              description: DESCRIPTION,
              buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_ENTRY}],
              timing: {showOnStart: true}
            }
          ]
        },
        [DESCRIPTION, BUTTON_1_LABEL]
      );
    });
    it('should show description and two buttons', () => {
      expectContainsInPopup(
        {
          description: 'cta description',
          messages: [
            {
              showToast: true,
              description: DESCRIPTION,
              buttons: [
                {label: BUTTON_1_LABEL, link: BUTTON_LINK_URL},
                {label: BUTTON_2_LABEL, link: BUTTON_LINK_ENTRY}
              ],
              timing: {showOnStart: true}
            }
          ]
        },
        [DESCRIPTION, BUTTON_1_LABEL, BUTTON_2_LABEL]
      );
    });
    it('should show title, description and one button', () => {
      expectContainsInPopup(
        {
          messages: [
            {
              showToast: true,
              title: TITLE,
              description: DESCRIPTION,
              buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}],
              timing: {showOnStart: true}
            }
          ]
        },
        [TITLE, DESCRIPTION, BUTTON_1_LABEL]
      );
    });
    it('should show title, description and two buttons', () => {
      expectContainsInPopup(
        {
          messages: [
            {
              title: TITLE,
              description: DESCRIPTION,
              showToast: true,
              buttons: [
                {label: BUTTON_1_LABEL, link: BUTTON_LINK_URL},
                {label: BUTTON_2_LABEL, link: BUTTON_LINK_ENTRY}
              ],
              timing: {showOnStart: true}
            }
          ]
        },
        [TITLE, DESCRIPTION, BUTTON_1_LABEL, BUTTON_2_LABEL]
      );
    });
    describe('buttons', () => {
      describe('close button', () => {
        it('should close popup on click', () => {
          expectCloseButtonInPopup({
            messages: [
              {
                showToast: true,
                buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}],
                timing: {showOnStart: true}
              }
            ]
          });
        });
      });
      describe('one button', () => {
        it('should open new window if link is a url', () => {
          expectWindowOpenInPopup(
            {
              messages: [
                {
                  showToast: true,
                  buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}, {}],
                  timing: {showOnStart: true}
                }
              ]
            },
            BUTTON_1_LABEL,
            BUTTON_LINK_URL
          );
        });
        it('should call loadMedia if link is not a url', () => {
          expectLoadMediaInPopup(
            {
              messages: [
                {
                  showToast: true,
                  buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_ENTRY}],
                  timing: {showOnStart: true}
                }
              ]
            },
            BUTTON_1_LABEL,
            BUTTON_LINK_ENTRY
          );
        });
      });
      describe('two buttons', () => {
        describe('click on button 1', () => {
          it('should open new window if link is a url', () => {
            expectWindowOpenInPopup(
              {
                messages: [
                  {
                    showToast: true,
                    buttons: [
                      {label: BUTTON_1_LABEL, link: BUTTON_LINK_URL},
                      {label: BUTTON_2_LABEL, link: BUTTON_LINK_ENTRY}
                    ],
                    timing: {showOnStart: true}
                  }
                ]
              },
              BUTTON_1_LABEL,
              BUTTON_LINK_URL
            );
          });
          it('should call loadMedia if link is not a url', () => {
            expectLoadMediaInPopup(
              {
                messages: [
                  {
                    showToast: true,
                    buttons: [
                      {label: BUTTON_1_LABEL, link: BUTTON_LINK_ENTRY},
                      {label: BUTTON_2_LABEL, link: BUTTON_LINK_URL}
                    ],
                    timing: {showOnStart: true}
                  }
                ]
              },
              BUTTON_1_LABEL,
              BUTTON_LINK_ENTRY
            );
          });
        });
        describe('click on button 2', () => {
          it('should open new window if link is a url', () => {
            expectWindowOpenInPopup(
              {
                messages: [
                  {
                    showToast: true,
                    buttons: [
                      {label: BUTTON_1_LABEL, link: BUTTON_LINK_ENTRY},
                      {label: BUTTON_2_LABEL, link: BUTTON_LINK_URL}
                    ],
                    timing: {showOnStart: true}
                  }
                ]
              },
              BUTTON_2_LABEL,
              BUTTON_LINK_URL
            );
          });
          it('should call loadMedia if link is not a url', () => {
            expectLoadMediaInPopup(
              {
                messages: [
                  {
                    showToast: true,
                    buttons: [
                      {label: BUTTON_1_LABEL, link: BUTTON_LINK_URL},
                      {label: BUTTON_2_LABEL, link: BUTTON_LINK_ENTRY}
                    ],
                    timing: {showOnStart: true}
                  }
                ]
              },
              BUTTON_2_LABEL,
              BUTTON_LINK_ENTRY
            );
          });
        });
      });
    });
  });
});
