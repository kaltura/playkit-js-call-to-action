import {h} from 'preact';

import {ButtonType} from '@playkit-js/common';
import {ButtonWithTooltip} from '../button-with-tooltip';

import * as styles from './call-to-action-buttons.scss';
import {MessageButtonData, MessageButtonType} from '../../types/message-data';

const CallToActionButtons = ({buttons, onClick}: {buttons: Array<MessageButtonData>; onClick: (messageButtonData: MessageButtonData) => void}) => {
  if (!buttons.length) {
    return null;
  } else if (buttons.length === 1) {
    const [button] = buttons;
    const buttonType = button.type === MessageButtonType.SECONDARY ? ButtonType.secondary : ButtonType.primary;

    return (
      <div className={`${styles.callToActionButtons}`}>
        <ButtonWithTooltip type={buttonType} label={button.label} onClick={(): void => onClick(button)} focusOnMount />
      </div>
    );
  }
  const [button1, button2] = buttons;

  const button1Type = button1.type === MessageButtonType.SECONDARY ? ButtonType.secondary : ButtonType.primary;
  const button2Type = button2.type === MessageButtonType.SECONDARY ? ButtonType.secondary : ButtonType.primary;

  return (
    <div className={styles.callToActionButtons}>
      <ButtonWithTooltip
        className={styles.focusIndicator}
        type={button1Type}
        label={button1.label}
        onClick={(): void => onClick(button1)}
        focusOnMount />
      <ButtonWithTooltip type={button2Type} label={button2.label} onClick={(): void => onClick(button2)} />
    </div>
  );
};

export {CallToActionButtons};
