import {
  expectCloseButton,
  expectContains,
  expectElementDoesntExist,
  expectElementDoesntExistAfter,
  expectElementDoesntExistAfterCloseAndSeek,
  expectElementExists,
  expectElementExistsAfterCloseAndSeek,
  expectElementExistsAfterSeek,
  expectElementExistsAt,
  expectElementExistsForTimeAfterSeek,
  expectElementsInOrder,
  expectLoadMedia,
  expectWindowOpen
} from './utils/env';

const TITLE = 'cta title';
const DESCRIPTION = 'cta description';
const BUTTON_1_LABEL = 'cta button 1';
const BUTTON_2_LABEL = 'cta button 2';
const BUTTON_LINK_URL = 'http://www.google.com';
const BUTTON_LINK_ENTRY = 'test';

const getOverlayElement = () => cy.get('[data-testid="call-to-action-overlay"]');

const getCloseButton = () => cy.get('[data-testid="call-to-action-overlay-close-button"] button');

const expectContainsInOverlay = (pluginConfig: any, texts: string[]) => {
  expectContains(pluginConfig, texts, getOverlayElement);
};
const expectCloseButtonInOverlay = (pluginConfig: any) => {
  expectCloseButton(pluginConfig, getCloseButton, getOverlayElement);
};
const expectWindowOpenInOverlay = (pluginConfig: any, buttonLabel: string, buttonLink: string) => {
  expectWindowOpen(pluginConfig, buttonLabel, buttonLink, getOverlayElement);
};
const expectLoadMediaInOverlay = (pluginConfig: any, buttonLabel: string, buttonLink: string) => {
  expectLoadMedia(pluginConfig, buttonLabel, buttonLink, getOverlayElement);
};
const expectOverlayExists = (pluginConfig: object) => {
  expectElementExists(pluginConfig, getOverlayElement);
};
const expectOverlayDoesntExist = (pluginConfig: object) => {
  expectElementDoesntExist(pluginConfig, getOverlayElement);
};
const expectOverlayExistsAt = (pluginConfig: object, expectedStartTime: number) => {
  expectElementExistsAt(pluginConfig, expectedStartTime, getOverlayElement);
};
const expectOverlayDoesntExistAfter = (pluginConfig: object, expectedStartTime: number, expectedDuration: number) => {
  expectElementDoesntExistAfter(pluginConfig, expectedStartTime, expectedDuration, getOverlayElement);
};
const expectOverlayElementsInOrder = (pluginConfig: Object, messsages: {messageStartTime?: number; messageText: string}[]) => {
  expectElementsInOrder(pluginConfig, messsages, getOverlayElement);
};

describe('call to action overlay', () => {
  describe('message validation', () => {
    describe('message content', () => {
      it('should not show message if title, description and buttons are not set', () => {
        expectOverlayDoesntExist({messages: [{timing: {showOnStart: true}}]});
      });
      describe('title', () => {
        it('should show message if title is set', () => {
          expectOverlayExists({messages: [{title: 'aaa', timing: {showOnStart: true}}]});
        });
      });
      describe('description', () => {
        it('should show message if description is set', () => {
          expectOverlayExists({messages: [{description: 'aaa', timing: {showOnStart: true}}]});
        });
      });
      describe('buttons', () => {
        it('should show message with one button', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should show message with two buttons', () => {
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
          expectOverlayDoesntExist({messages: [{buttons: [{link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button label is not a string', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: -1, link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button label is an empty string', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: '', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is not set', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: ''}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is not a string', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: -1}], timing: {showOnStart: true}}]});
        });
        it('should not show message if button link is an empty string', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: ''}], timing: {showOnStart: true}}]});
        });
      });
    });
    describe('message timing', () => {
      it('should not show message if timing is undefined', () => {
        expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}]}]});
      });
      it('should not show message if none of the timing fields are set', () => {
        expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {}}]});
      });
      describe('showOnStart', () => {
        it('should show message if showOnStart is true', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true}}]});
        });
        it('should not show message if showOnStart is not true', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: false}}]});
        });
        it('should not show message if showOnStart is not boolean', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: 1}}]});
        });
      });
      describe('showOnEnd', () => {
        it('should show message if showOnEnd is true', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: true}}]});
        });
        it('should not show message if showOnEnd is not true', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: false}}]});
        });
        it('should not show message if showOnEnd is not boolean', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnEnd: 1}}]});
        });
      });
      describe('timeFromStart', () => {
        it('should show message if timeFromStart is a positive number', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 1}}]});
        });
        it('should show message if timeFromStart is zero', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 0}}]});
        });
        it('should not show message if timeFromStart is a negative number', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: -1}}]});
        });
        it('should not show message if timeFromStart is not a number', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromStart: 'aaa'}}]});
        });
      });
      describe('timeFromEnd', () => {
        it('should show message if timeFromEnd is a positive number', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 1}}]});
        });
        it('should show message if timeFromEnd is zero', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 0}}]});
        });
        it('should not show message if timeFromEnd is not a negative number', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: -1}}]});
        });
        it('should not show message if timeFromEnd is not a number', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {timeFromEnd: 'aaa'}}]});
        });
      });
      describe('duration', () => {
        it('should show message if duration is not a positive number', () => {
          expectOverlayExists({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 1}}]});
        });
        it('should not show message if duration is zero', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 0}}]});
        });
        it('should not show message if duration is negative', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: -1}}]});
        });
        it('should not show message if duration is not a number', () => {
          expectOverlayDoesntExist({messages: [{buttons: [{label: 'aaa', link: 'aaa'}], timing: {showOnStart: true, duration: 'aaa'}}]});
        });
      });
    });
  });
  describe('message timing', () => {
    describe('start time and duration', () => {
      describe('show on start', () => {
        it('should display message on playback start', () => {
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
    describe('seeking to a different time', () => {
      it('should show a message again if it ended without being closed', () => {
        expectElementExistsAfterSeek(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  showOnStart: true,
                  duration: 1
                }
              }
            ]
          },
          0,
          getOverlayElement
        );
      });
      it('should not show a message again if it was closed', () => {
        expectElementDoesntExistAfterCloseAndSeek(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  showOnStart: true,
                  duration: 1
                }
              }
            ]
          },
          0,
          getCloseButton,
          getOverlayElement
        );
      });
      it('should show a message if again if it was closed but has redisplayMessage set to true', () => {
        expectElementExistsAfterCloseAndSeek(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  redisplayMessage: true,
                  showOnStart: true,
                  duration: 1
                }
              }
            ]
          },
          0,
          getCloseButton,
          getOverlayElement
        );
      });
      it('should show a message when seeking into its time range until its remaining duration ends', () => {
        expectElementExistsForTimeAfterSeek(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  redisplayMessage: true,
                  showOnStart: true,
                  duration: 3
                }
              }
            ]
          },
          1,
          2,
          getOverlayElement
        );
      });
    });
  });
  describe('messages order', () => {
    describe('first message is showOnStart', () => {
      it('should show both messages in the correct order if the second message is timeFromStart', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  showOnStart: true,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromStart: 2
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show both messages in the correct order if the second message is timeFromEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  showOnStart: true,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromEnd: 3
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show both messages in the correct order if the second message is showOnEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  showOnStart: true,
                  duration: 2
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  showOnEnd: true
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
    });
    describe('first message is timeFromStart', () => {
      it('should show both messages in the correct order if the second message is timeFromStart', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromStart: 1,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromStart: 3,
                  duration: 1
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show both messages in the correct order if the second message is timeFromEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromStart: 1,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromEnd: 0,
                  duration: 1
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show both messages in the correct order if the second message is showOnEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromStart: 1,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  showOnEnd: true
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show three messages in the correct order if the second message is timeFromStart and the third message is timeFromEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromStart: 1,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromStart: 2,
                  duration: 1
                }
              },
              {
                buttons: [
                  {
                    label: BUTTON_1_LABEL,
                    link: BUTTON_LINK_URL
                  }
                ],
                timing: {
                  timeFromEnd: 1,
                  duration: 1
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}, {messageText: BUTTON_1_LABEL}]
        );
      });
    });
    describe('first message is timeFromEnd', () => {
      it('should show both messages in the correct order if the second message is timeFromStart', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromEnd: 4,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromStart: 3
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show both messages in the correct order if the second message is timeFromEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromEnd: 3,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  timeFromEnd: 0
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
      it('should show both messages in the correct order if the second message is showOnEnd', () => {
        expectOverlayElementsInOrder(
          {
            messages: [
              {
                title: TITLE,
                timing: {
                  timeFromEnd: 3,
                  duration: 1
                }
              },
              {
                description: DESCRIPTION,
                timing: {
                  showOnEnd: true
                }
              }
            ]
          },
          [{messageText: TITLE}, {messageText: DESCRIPTION}]
        );
      });
    });
  });

  describe('overlay content', () => {
    it('should show title', () => {
      expectContainsInOverlay({messages: [{title: TITLE, timing: {showOnStart: true}}]}, [TITLE]);
    });
    it('should show description', () => {
      expectContainsInOverlay({messages: [{description: DESCRIPTION, timing: {showOnStart: true}}]}, [DESCRIPTION]);
    });
    it('should show one button', () => {
      expectContainsInOverlay(
        {
          messages: [{buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}], timing: {showOnStart: true}}]
        },
        [BUTTON_1_LABEL]
      );
    });
    it('should show two buttons', () => {
      expectContainsInOverlay(
        {
          messages: [
            {
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
      expectContainsInOverlay(
        {
          messages: [{title: TITLE, description: DESCRIPTION, timing: {showOnStart: true}}]
        },
        [TITLE, DESCRIPTION]
      );
    });
    it('should show title and one button', () => {
      expectContainsInOverlay(
        {
          messages: [
            {
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
      expectContainsInOverlay(
        {
          title: 'cta title',
          messages: [
            {
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
      expectContainsInOverlay(
        {
          messages: [
            {
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
      expectContainsInOverlay(
        {
          description: 'cta description',
          messages: [
            {
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
      expectContainsInOverlay(
        {
          messages: [
            {
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
      expectContainsInOverlay(
        {
          messages: [
            {
              title: TITLE,
              description: DESCRIPTION,

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
          expectCloseButtonInOverlay({
            messages: [
              {
                buttons: [{label: BUTTON_1_LABEL, link: BUTTON_LINK_URL}],
                timing: {showOnStart: true}
              }
            ]
          });
        });
      });
      describe('one button', () => {
        it('should open new window if link is a url', () => {
          expectWindowOpenInOverlay(
            {
              messages: [
                {
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
          expectLoadMediaInOverlay(
            {
              messages: [
                {
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
            expectWindowOpenInOverlay(
              {
                messages: [
                  {
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
            expectLoadMediaInOverlay(
              {
                messages: [
                  {
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
            expectWindowOpenInOverlay(
              {
                messages: [
                  {
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
            expectLoadMediaInOverlay(
              {
                messages: [
                  {
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
