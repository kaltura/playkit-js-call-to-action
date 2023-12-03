import {Button, ButtonType, ButtonSize, A11yWrapper} from '@playkit-js/common';

import {ui} from '@playkit-js/kaltura-player-js';
const {withText} = ui.preacti18n;

import {TextWithTooltip} from '../text-with-tooltip';
import {CallToActionButtons} from '../call-to-action-buttons';

import * as styles from './call-to-action-overlay.scss';

interface CallToActionOverlayProps {
  title: string;
  description: string;
  buttons: Array<{label: string; link: string}>;
  onClose: () => void;
  onClick: (link: string) => void;
  closeLabel: string;
  descriptionLines: number;
}

const CallToActionOverlay = withText({closeLabel: 'overlay.close'})(
  ({title, description, buttons, onClose, onClick, closeLabel, descriptionLines}: CallToActionOverlayProps) => {
    return (
      <div className={styles.callToActionOverlay}>
        <div className={styles.closeButton}>
          <A11yWrapper onClick={onClose}>
            <Button type={ButtonType.borderless} size={ButtonSize.medium} tooltip={{label: closeLabel!}} ariaLabel={closeLabel} icon={'close'} />
          </A11yWrapper>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.title}>
              <TextWithTooltip text={title || ''} numberOfLines={1}></TextWithTooltip>
            </div>

            <div className={styles.description}>
              <TextWithTooltip text={description || ''} numberOfLines={descriptionLines}></TextWithTooltip>
            </div>

            <div className={styles.buttonsContainer}>
              <CallToActionButtons buttons={buttons} onClick={onClick} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export {CallToActionOverlay};
