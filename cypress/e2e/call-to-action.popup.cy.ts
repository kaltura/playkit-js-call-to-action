import {expectCloseButton, expectContains, expectLoadMedia, expectWindowOpen, getPopupElement} from './utils/env';

const TITLE = 'cta title';
const DESCRIPTION = 'cta description';
const BUTTON_1_LABEL = 'cta button 1';
const BUTTON_2_LABEL = 'cta button 2';
const BUTTON_LINK_URL = 'http://www.google.com';
const BUTTON_LINK_ENTRY = 'test';

const getCloseButton = () => cy.get('[data-testid="call-to-action-popup-close-button"] button');

const expectContainsInPopup = (pluginConfig: any, texts: string[]) => expectContains(pluginConfig, texts, getPopupElement);
const expectCloseButtonInPopup = (pluginConfig: any) => {
  expectCloseButton(pluginConfig, getPopupElement, getCloseButton);
};
const expectWindowOpenInPopup = (pluginConfig: any, buttonLabel: string, buttonLink: string) => {
  expectWindowOpen(pluginConfig, buttonLabel, buttonLink, getPopupElement);
};
const expectLoadMediaInPopup = (pluginConfig: any, buttonLabel: string, buttonLink: string) =>
  expectLoadMedia(pluginConfig, buttonLabel, buttonLink, getPopupElement);

describe('call to action popup', () => {
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
