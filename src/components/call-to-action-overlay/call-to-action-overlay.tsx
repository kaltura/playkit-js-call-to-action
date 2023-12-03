import {Button, ButtonType, ButtonSize, A11yWrapper} from '@playkit-js/common';

import {ui} from '@playkit-js/kaltura-player-js';
const {PLAYER_SIZE} = ui.Components;
const {withText} = ui.preacti18n;
const {connect} = ui.redux;

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
  sizeClass: string;
}

const mapStateToProps = (state: any) => {
  const {
    shell: {playerSize}
  } = state;
  let sizeClass = '';

  switch (playerSize) {
    case PLAYER_SIZE.EXTRA_LARGE:
    case PLAYER_SIZE.LARGE: {
      sizeClass = styles.large;
      break;
    }
    case PLAYER_SIZE.MEDIUM: {
      sizeClass = styles.medium;
      break;
    }
    case PLAYER_SIZE.SMALL:
    case PLAYER_SIZE.EXTRA_SMALL: {
      sizeClass = styles.small;
      break;
    }
    default: {
      break;
    }
  }

  return {
    sizeClass
  };
};

const CallToActionOverlay = withText({closeLabel: 'overlay.close'})(
  connect(mapStateToProps)(
    ({title, description, buttons, onClose, onClick, closeLabel, descriptionLines, sizeClass}: CallToActionOverlayProps): any => {
      return (
        <div className={`${styles.callToActionOverlay} ${sizeClass}`}>
          <div className={styles.closeButton}>
            <A11yWrapper onClick={onClose}>
              <Button type={ButtonType.borderless} size={ButtonSize.medium} tooltip={{label: closeLabel!}} ariaLabel={closeLabel} icon={'close'} />
            </A11yWrapper>
          </div>
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
      );
    }
  )
);

export {CallToActionOverlay};
