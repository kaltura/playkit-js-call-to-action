import {expectCloseButton, expectContains, expectLoadMedia, expectWindowOpen, getOverlayElement} from './utils/env';

const TITLE = 'cta title';
const DESCRIPTION = 'cta description';
const BUTTON_1_LABEL = 'cta button 1';
const BUTTON_2_LABEL = 'cta button 2';
const BUTTON_LINK_URL = 'http://www.google.com';
const BUTTON_LINK_ENTRY = 'test';

const getCloseButton = () => cy.get('[data-testid="call-to-action-overlay-close-button"] button');

const expectContainsInOverlay = (pluginConfig: any, texts: string[]) => {
  expectContains(pluginConfig, texts, getOverlayElement);
};
const expectCloseButtonInOverlay = (pluginConfig: any) => {
  expectCloseButton(pluginConfig, getOverlayElement, getCloseButton);
};
const expectWindowOpenInOverlay = (pluginConfig: any, buttonLabel: string, buttonLink: string) => {
  expectWindowOpen(pluginConfig, buttonLabel, buttonLink, getOverlayElement);
};
const expectLoadMediaInOverlay = (pluginConfig: any, buttonLabel: string, buttonLink: string) => {
  expectLoadMedia(pluginConfig, buttonLabel, buttonLink, getOverlayElement);
};

describe('call to action overlay', () => {
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
