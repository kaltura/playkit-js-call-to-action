import {KalturaPlayer, ui} from '@playkit-js/kaltura-player-js';
const {PLAYER_SIZE} = ui.Components;

import {FloatingManager} from '@playkit-js/common/dist/ui-common/floating-manager';
import {FloatingItem, FloatingPositions, FloatingUIModes} from '@playkit-js/common/dist/ui-common';

import {MessageData} from './types';
import {CallToActionOverlay, CallToActionPopup} from './components';

const DESCRIPTION_LINES_SMALL = 2;
const DESCRIPTION_LINES_LARGE = 4;

class CallToActionManager {
  private playOnClose = false;
  private removeActiveOverlay: null | (() => void) = null;
  private store: any;
  private player: KalturaPlayer;
  private popupInstance: FloatingItem | null = null;
  private floatingManager: FloatingManager;
  private hideMessageTimeout = -1;

  constructor(player: KalturaPlayer, floatingManager: FloatingManager) {
    this.player = player;
    this.store = ui.redux.useStore();
    this.floatingManager = floatingManager;
  }

  private showPopup({title, description, buttons}: MessageData) {
    this.popupInstance = this.floatingManager.add({
      label: 'Call To Action Popup',
      mode: FloatingUIModes.Immediate,
      position: FloatingPositions.InteractiveArea,
      renderContent: () => <CallToActionPopup title={title} description={description} buttons={buttons} onClose={() => this.hidePopup()} />
    });
  }

  private hidePopup() {
    this.floatingManager.remove(this.popupInstance!);
    this.popupInstance = null;
  }

  private showOverlay(message: MessageData, descriptionLines: number) {
    if (!this.player.paused) {
      this.player.pause();
      this.playOnClose = true;
    }

    const {title, description, buttons} = message;
    this.setOverlay(
      this.player.ui.addComponent({
        label: 'callToActionOverlay',
        area: ui.ReservedPresetAreas.GuiArea,
        presets: [ui.ReservedPresetNames.Playback, ui.ReservedPresetNames.Live],
        get: () => (
          <CallToActionOverlay
            title={title}
            description={description}
            buttons={buttons}
            onClick={(link: string) => this.onCallToActionButtonClick(link)}
            onClose={() => this.onOverlayCloseClick()}
            descriptionLines={descriptionLines}
          />
        )
      })
    );
  }

  private setOverlay(fn: () => void): void {
    this.removeOverlay();
    this.removeActiveOverlay = fn;
  }

  private removeOverlay(): void {
    if (this.removeActiveOverlay) {
      this.removeActiveOverlay();
      this.removeActiveOverlay = null;
    }
  }

  private onOverlayCloseClick() {
    this.removeOverlay();
    if (this.playOnClose) {
      this.player.play();
      this.playOnClose = false;
    }
  }

  private onCallToActionButtonClick(link: string) {
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else {
      // TODO use updated player types
      // @ts-ignore
      this.player.loadMedia({entryId: link});
    }
    this.removeMessage();
  }

  public addMessage(message: MessageData) {
    switch (this.store.getState().shell.playerSize) {
      case PLAYER_SIZE.TINY: {
        return;
      }
      case PLAYER_SIZE.EXTRA_SMALL:
      case PLAYER_SIZE.SMALL: {
        this.showOverlay(message, DESCRIPTION_LINES_SMALL);
        break;
      }
      case PLAYER_SIZE.MEDIUM:
      case PLAYER_SIZE.LARGE:
      case PLAYER_SIZE.EXTRA_LARGE: {
        if (message.showToast) {
          this.showPopup(message);
        } else {
          this.showOverlay(message, DESCRIPTION_LINES_LARGE);
        }
      }
    }

    if (message.timing.duration) {
      this.hideMessageTimeout = window.setTimeout(() => {
        this.removeMessage();
        this.hideMessageTimeout = -1;
      }, message.timing.duration * 1000);
    }
  }

  public removeMessage() {
    if (this.popupInstance) {
      this.hidePopup();
    } else {
      this.onOverlayCloseClick();
    }

    if (this.hideMessageTimeout !== -1) {
      window.clearTimeout(this.hideMessageTimeout);
      this.hideMessageTimeout = -1;
    }
  }
}

export {CallToActionManager};
