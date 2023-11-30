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
  onClick: (link: string) => void;
  onClose: () => void;
  closeLabel: string;
}

const CallToActionPopup = withText({closeLabel: 'overlay.close'})(
  ({title, description, buttons, onClick, onClose, closeLabel}: CallToActionPopupProps) => {
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

        <CallToActionButtons buttons={buttons} onClick={onClick} />
      </div>
    );
  }
);

const CallToActionButtons = ({buttons, onClick}: {buttons: Array<{label: string; link: string}>; onClick: (link: string) => void}) => {
  if (!buttons.length) {
    return <Fragment />;
  } else if (buttons.length === 1) {
    const [button] = buttons;
    return (
      <div className={`${styles.buttonsContainer} ${styles.oneButton}`}>
        <ButtonWithTooltip type={ButtonType.secondary} label={button.label} onClick={(): void => onClick(button.link)}></ButtonWithTooltip>
      </div>
    );
  } else {
    const [button1, button2] = buttons;
    return (
      <div className={`${styles.buttonsContainer} ${styles.twoButtons}`}>
        <ButtonWithTooltip type={ButtonType.secondary} label={button1.label} onClick={(): void => onClick(button1.link)}></ButtonWithTooltip>
        <ButtonWithTooltip type={ButtonType.primary} label={button2.label} onClick={(): void => onClick(button2.link)}></ButtonWithTooltip>
      </div>
    );
  }
};

export {CallToActionPopup};
