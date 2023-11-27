import {Button, ButtonType, ButtonSize, A11yWrapper} from '@playkit-js/common';

// TODO
// @ts-ignore
const {ui} = window.KalturaPlayer;
const {withText} = ui.preacti18n;

import * as styles from './call-to-action-overlay.scss';
import {TextWithTooltip} from '../text-with-tooltip';

interface CallToActionOverlayProps {
  title: string;
  description: string;
  buttons: Array<{label: string; link: string}>;
  onClose: () => void;
  closeLabel: string;
}

const CallToActionOverlay = withText({closeLabel: 'overlay.close'})(
  ({title, description, buttons, onClose, closeLabel}: CallToActionOverlayProps) => {
    return (
      <div className={styles.callToActionOverlay}>
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
      </div>
    );
  }
);

export {CallToActionOverlay};
