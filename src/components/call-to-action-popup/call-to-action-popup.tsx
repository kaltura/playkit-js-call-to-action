import {Button, ButtonType, ButtonSize, A11yWrapper} from '@playkit-js/common';
import {ui} from '@playkit-js/kaltura-player-js';
const {withText} = ui.preacti18n;

import {TextWithTooltip} from '../text-with-tooltip';
import {CallToActionButtons} from '../call-to-action-buttons';

import * as styles from './call-to-action-popup.scss';
import {MessageButtonData} from '../../types';
interface CallToActionPopupProps {
  title: string;
  description: string;
  buttons: MessageButtonData[];
  onClick: (link: string) => void;
  onClose: () => void;
  closeLabel: string;
}

const CallToActionPopup = withText({closeLabel: 'overlay.close'})(
  ({title, description, buttons, onClick, onClose, closeLabel}: CallToActionPopupProps) => {
    return (
      <div className={styles.callToActionPopup}>
        <div className={styles.closeButton}>
          <Button
            onClick={onClose}
            type={ButtonType.borderlessTranslucent}
            size={ButtonSize.medium}
            tooltip={{label: closeLabel!}}
            ariaLabel={closeLabel}
            icon={'close'}
          />
        </div>

        <div className={styles.title}>
          <TextWithTooltip text={title || ''} numberOfLines={1}></TextWithTooltip>
        </div>
        <div className={styles.description}>
          <TextWithTooltip text={description || ''} numberOfLines={2}></TextWithTooltip>
        </div>

        <div className={styles.buttonsContainer}>
          <CallToActionButtons buttons={buttons} onClick={onClick} />
        </div>
      </div>
    );
  }
);

export {CallToActionPopup};
