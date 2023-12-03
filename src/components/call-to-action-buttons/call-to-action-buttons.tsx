import {Fragment} from 'preact';
import {ButtonType} from '@playkit-js/common';
import {ButtonWithTooltip} from '../button-with-tooltip';

import * as styles from './call-to-action-buttons.scss';

const CallToActionButtons = ({buttons, onClick}: {buttons: Array<{label: string; link: string}>; onClick: (link: string) => void}) => {
  if (!buttons.length) {
    return <Fragment />;
  } else if (buttons.length === 1) {
    const [button] = buttons;
    return (
      <div className={`${styles.callToActionButtons}`}>
        <ButtonWithTooltip type={ButtonType.secondary} label={button.label} onClick={(): void => onClick(button.link)}></ButtonWithTooltip>
      </div>
    );
  } else {
    const [button1, button2] = buttons;
    return (
      <div className={`${styles.callToActionButtons} ${styles.twoButtons}`}>
        <ButtonWithTooltip type={ButtonType.secondary} label={button1.label} onClick={(): void => onClick(button1.link)}></ButtonWithTooltip>
        <ButtonWithTooltip type={ButtonType.primary} label={button2.label} onClick={(): void => onClick(button2.link)}></ButtonWithTooltip>
      </div>
    );
  }
};

export {CallToActionButtons};
