import {expectElementContains, getPlayButtonElement, getPopupElement, loadPlayerAndSetMedia} from './utils/env';

const TITLE = 'cta title';
const DESCRIPTION = 'cta description';
const BUTTON_1_LABEL = 'cta button 1';
const BUTTON_1_LINK = 'http://www.google.com';
const BUTTON_2_LABEL = 'cta button 2';
const BUTTON_2_LINK = 'test';

const expectPopupContains = (texts: string[]) => expectElementContains(getPopupElement, texts);
const getCloseButton = () => cy.get('[data-testid="call-to-action-popup-close-button"] button');

describe('call to action popup', () => {
  it('should show title', () => {
    loadPlayerAndSetMedia({messages: [{showToast: true, title: TITLE, timing: {showOnStart: true}}]}).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([TITLE]);
    });
  });
  it('should show description', () => {
    loadPlayerAndSetMedia({messages: [{showToast: true, description: DESCRIPTION, timing: {showOnStart: true}}]}).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([DESCRIPTION]);
    });
  });
  it('should show one button', () => {
    loadPlayerAndSetMedia({
      messages: [{showToast: true, buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}], timing: {showOnStart: true}}]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([BUTTON_1_LABEL]);
    });
  });
  it('should show two buttons', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          showToast: true,
          buttons: [
            {label: BUTTON_1_LABEL, link: BUTTON_1_LINK},
            {label: BUTTON_2_LABEL, link: BUTTON_2_LINK}
          ],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
  it('should show title and description', () => {
    loadPlayerAndSetMedia({
      messages: [{showToast: true, title: TITLE, description: DESCRIPTION, timing: {showOnStart: true}}]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([TITLE, DESCRIPTION]);
    });
  });
  it('should show title and one button', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          showToast: true,
          title: TITLE,
          buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([TITLE, BUTTON_1_LABEL]);
    });
  });
  it('should show title and two buttons', () => {
    loadPlayerAndSetMedia({
      title: 'cta title',
      messages: [
        {
          showToast: true,
          title: 'cta title',
          buttons: [
            {label: BUTTON_1_LABEL, link: BUTTON_1_LINK},
            {label: BUTTON_2_LABEL, link: BUTTON_2_LINK}
          ],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([TITLE, BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
  it('should show description and one button', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          showToast: true,
          description: DESCRIPTION,
          buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([DESCRIPTION, BUTTON_1_LABEL]);
    });
  });
  it('should show description and two buttons', () => {
    loadPlayerAndSetMedia({
      description: 'cta description',
      messages: [
        {
          showToast: true,
          description: DESCRIPTION,
          buttons: [
            {label: BUTTON_1_LABEL, link: BUTTON_1_LINK},
            {label: BUTTON_2_LABEL, link: BUTTON_2_LINK}
          ],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([DESCRIPTION, BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
  it('should show title, description and one button', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          showToast: true,
          title: TITLE,
          description: DESCRIPTION,
          buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([TITLE, DESCRIPTION, BUTTON_1_LABEL]);
    });
  });
  it('should show title, description and two buttons', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          title: TITLE,
          description: DESCRIPTION,
          showToast: true,
          buttons: [
            {label: BUTTON_1_LABEL, link: BUTTON_1_LINK},
            {label: BUTTON_2_LABEL, link: BUTTON_2_LINK}
          ],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectPopupContains([TITLE, DESCRIPTION, BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });

  describe.only('buttons', () => {
    describe('close button', () => {
      it('should close popup on click', () => {
        loadPlayerAndSetMedia({
          messages: [
            {
              showToast: true,
              buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
              timing: {showOnStart: true}
            }
          ]
        }).then(() => {
          getPlayButtonElement().should('exist').click({force: true});
          getPlayButtonElement().should('not.exist');
          getPopupElement().should('exist');
          getCloseButton().click({force: true});
          getPopupElement().should('not.exist');
        });
      });
    });
    // describe('one button', () => {
    //   it('should open new window if link is a url', () => {
    //     loadPlayerAndSetMedia({
    //       messages: [
    //         {
    //           showToast: true,
    //           buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}, {}],
    //           timing: {showOnStart: true}
    //         }
    //       ]
    //     }).then(() => {
    //       cy.window().then(win => {
    //         cy.stub(win, 'open').as('Open');
    //       });

    //       getPlayButtonElement().should('exist').click({force: true});
    //       getPlayButtonElement().should('not.exist');
    //       getPopupElement().contains(BUTTON_1_LABEL).click({force: true});
    //       cy.get('@Open').should('have.been.calledOnceWith', [BUTTON_1_LINK, '"_blank"']);
    //     });
    //   });
    //   it('should call loadMedia if link is not a url', () => {
    //     loadPlayerAndSetMedia({
    //       messages: [
    //         {
    //           showToast: true,
    //           buttons: [
    //             {label: BUTTON_1_LABEL, link: BUTTON_1_LINK},
    //             {label: BUTTON_2_LABEL, link: BUTTON_2_LINK}
    //           ],
    //           timing: {showOnStart: true}
    //         }
    //       ]
    //     }).then(() => {
    //       cy.window().then(win => {
    //         cy.stub(win.KalturaPlayer, 'loadMedia').as('LoadMedia');
    //       });

    //       getPlayButtonElement().should('exist').click({force: true});
    //       getPlayButtonElement().should('not.exist');
    //       getPopupElement().contains(BUTTON_2_LABEL).click({force: true});
    //       cy.get('@LoadMedia').should('have.been.calledOnceWith', [BUTTON_2_LINK]);
    //     });
    //   });
    // });
    // describe('two buttons', () => {
    //   describe('click on button 1');
    //   describe('click on button 2');
    // });
  });
});

// TODO 1 button click
// TODO 2 buttons click
