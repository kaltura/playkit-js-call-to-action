// import {PlaykitUI} from '@playkit-js/kaltura-player-js';

import {Button, ButtonType, ButtonSize, A11yWrapper} from '@playkit-js/common';
import {Fragment} from 'preact';

import * as styles from './call-to-action-popup.scss';
import {TextWithTooltip} from '../text-with-tooltip';
import {ButtonWithTooltip} from '../button-with-tooltip';
// import {KalturaPlayer} from '@playkit-js/kaltura-player-js';

// TODO
// @ts-ignore
const {ui} = window.KalturaPlayer;
const {Tooltip} = ui.components;
const {withText} = ui.preacti18n;

interface CallToActionPopupProps {
  title: string;
  description: string;
  buttons: Array<{label: string; link: string}>;
  onClose: () => void;
  closeLabel: string;
}

const CallToActionPopup = withText({closeLabel: 'overlay.close'})(({title, description, buttons, onClose, closeLabel}: CallToActionPopupProps) => {
  return (
    <div className={styles.callToActionPopup}>
      <div className={styles.closeButton}>
        <A11yWrapper onClick={onClose}>
          <Button type={ButtonType.borderless} size={ButtonSize.medium} tooltip={{label: closeLabel!}} ariaLabel={closeLabel} icon={'close'} />
        </A11yWrapper>
      </div>

      <div className={styles.title}>
        <TextWithTooltip text={title || ''} numberOfLines={1}></TextWithTooltip>
      </div>
      <div className={styles.description}>
        <TextWithTooltip text={description || ''} numberOfLines={2}></TextWithTooltip>
      </div>

      <CallToActionButtons buttons={buttons || []} />
    </div>
  );
});

const CallToActionButtons = ({buttons}: {buttons: Array<{label: string; link: string}>}) => {
  const onClick = (url: string) => {
    // TODO fire an event
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      // TODO entry id - switch entry
    }
  };

  if (!buttons.length) {
    return <Fragment />;
  } else if (buttons.length === 1) {
    const [button] = buttons;
    return (
      <div className={`${styles.buttonsContainer} ${styles.oneButton}`}>
        {/* <Button type={ButtonType.secondary} onClick={(): void => onClick(button.link)} disabled={false}>
          <TextWithTooltip text={button.label || ''} numberOfLines={1}></TextWithTooltip>
        </Button> */}
        <ButtonWithTooltip type={ButtonType.secondary} label={button.label} onClick={(): void => onClick(button.link)}></ButtonWithTooltip>
      </div>
    );
  } else {
    const [button1, button2] = buttons;
    return (
      <div className={`${styles.buttonsContainer} ${styles.twoButtons}`}>
        {/* <Button type={ButtonType.secondary} onClick={(): void => onClick(button1.link)} disabled={false}>
          <Button type={ButtonType.secondary} onClick={(): void => onClick(button1.link)} disabled={false}>
            <TextWithTooltip text={button1.label || ''} numberOfLines={1}></TextWithTooltip>
          </Button>
        </Button>
        <Button type={ButtonType.primary} onClick={(): void => onClick(button2.link)} disabled={false}>
          <TextWithTooltip text={button2.label || ''} numberOfLines={1}></TextWithTooltip>
        </Button> */}

        <ButtonWithTooltip type={ButtonType.secondary} label={button1.label} onClick={(): void => onClick(button1.link)}></ButtonWithTooltip>
        <ButtonWithTooltip type={ButtonType.primary} label={button2.label} onClick={(): void => onClick(button2.link)}></ButtonWithTooltip>
      </div>
    );
  }
};

export {CallToActionPopup};
