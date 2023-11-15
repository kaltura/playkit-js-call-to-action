// import {PlaykitUI} from '@playkit-js/kaltura-player-js';

import {Button, ButtonType, ButtonSize, A11yWrapper, OnClickEvent} from '@playkit-js/common';

import * as styles from './call-to-action-popup.scss';
import {TextWithTooltip} from '../text-with-tooltip';
// import {KalturaPlayer} from '@playkit-js/kaltura-player-js';

// TODO
// @ts-ignore
const {Tooltip} = window.KalturaPlayer.ui.components;

interface CallToActionPopupProps {
  title?: string;
  description?: string;
  buttons?: Array<{label: string; link: string}>;
  onClose: () => void;
}

const CallToActionPopup = ({title, description, buttons, onClose}: CallToActionPopupProps) => {
  return (
    <div className={styles.callToActionPopup}>
      <div className={styles.closeButton}>
        <A11yWrapper onClick={onClose}>
          <Button
            type={ButtonType.borderless}
            size={ButtonSize.medium}
            //   tooltip={{label: closeLabel!}}
            //   ariaLabel={closeLabel}
            icon={'close'}
            //   setRef={ref => {
            //     closeButtonRef.current = ref;
            //   }}
          />
        </A11yWrapper>
      </div>

      <div className={styles.title}>
        <TextWithTooltip text={title || ''} numberOfLines={1}></TextWithTooltip>
      </div>
      <div className={styles.description}>
        <TextWithTooltip text={description || ''} numberOfLines={2}></TextWithTooltip>
      </div>

      {/* <Tooltip label={title || ''}>
        <div className={styles.title}>{title || ''}</div>
      </Tooltip>
      <Tooltip label={description || ''}>
        <div className={styles.description}>{description || ''}</div>
      </Tooltip> */}

      <div className={styles.buttonsContainer}></div>
    </div>
  );
};

export {CallToActionPopup};
