import {expectElementContains, getOverlayElement, getPlayButtonElement, loadPlayerAndSetMedia} from './utils/env';

const TITLE = 'cta title';
const DESCRIPTION = 'cta description';
const BUTTON_1_LABEL = 'cta button 1';
const BUTTON_1_LINK = 'http://www.google.com';
const BUTTON_2_LABEL = 'cta button 2';
const BUTTON_2_LINK = 'test';

const expectOverlayContains = (texts: string[]) => expectElementContains(getOverlayElement, texts);

describe('call to action popup', () => {
  it('should show title', () => {
    loadPlayerAndSetMedia({messages: [{title: TITLE, timing: {showOnStart: true}}]}).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([TITLE]);
    });
  });
  it('should show description', () => {
    loadPlayerAndSetMedia({messages: [{description: DESCRIPTION, timing: {showOnStart: true}}]}).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([DESCRIPTION]);
    });
  });
  it('should show one button', () => {
    loadPlayerAndSetMedia({
      messages: [{buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}], timing: {showOnStart: true}}]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([BUTTON_1_LABEL]);
    });
  });
  it('should show two buttons', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
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
      expectOverlayContains([BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
  it('should show title and description', () => {
    loadPlayerAndSetMedia({
      messages: [{title: TITLE, description: DESCRIPTION, timing: {showOnStart: true}}]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([TITLE, DESCRIPTION]);
    });
  });
  it('should show title and one button', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          title: TITLE,
          buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([TITLE, BUTTON_1_LABEL]);
    });
  });
  it('should show title and two buttons', () => {
    loadPlayerAndSetMedia({
      title: 'cta title',
      messages: [
        {
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
      expectOverlayContains([TITLE, BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
  it('should show description and one button', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          description: DESCRIPTION,
          buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([DESCRIPTION, BUTTON_1_LABEL]);
    });
  });
  it('should show description and two buttons', () => {
    loadPlayerAndSetMedia({
      description: 'cta description',
      messages: [
        {
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
      expectOverlayContains([DESCRIPTION, BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
  it('should show title, description and one button', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          title: TITLE,
          description: DESCRIPTION,
          buttons: [{label: BUTTON_1_LABEL, link: BUTTON_1_LINK}],
          timing: {showOnStart: true}
        }
      ]
    }).then(() => {
      getPlayButtonElement().should('exist').click({force: true});
      getPlayButtonElement().should('not.exist');
      expectOverlayContains([TITLE, DESCRIPTION, BUTTON_1_LABEL]);
    });
  });
  it('should show title, description and two buttons', () => {
    loadPlayerAndSetMedia({
      messages: [
        {
          title: TITLE,
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
      expectOverlayContains([TITLE, DESCRIPTION, BUTTON_1_LABEL, BUTTON_2_LABEL]);
    });
  });
});

// TODO close button click
// TODO button 1 click
// TODO button 2 click
