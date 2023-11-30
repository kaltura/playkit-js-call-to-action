import {KalturaPlayer, ui} from '@playkit-js/kaltura-player-js';
import {FloatingItem, FloatingManager, ToastManager, BannerManager} from '@playkit-js/ui-managers';

import {MessageData} from './types';
import {CallToActionOverlay, CallToActionPopup} from './components';

// TODO
// @ts-ignore
const {components, redux} = ui;
const {PLAYER_SIZE} = components;

class CallToActionManager {
  private playOnClose = false;
  private removeActiveOverlay: null | (() => void) = null;
  private store: any;
  private player: KalturaPlayer;
  private popupInstance: FloatingItem | null = null;

  constructor(player: KalturaPlayer) {
    this.player = player;
    this.store = redux.useStore();
  }

  private get floatingManager(): FloatingManager {
    return (this.player.getService('floatingManager') as FloatingManager) || {};
  }

  private showPopup({title, description, buttons}: MessageData) {
    this.popupInstance = this.floatingManager.add({
      label: 'Call To Action Popup',
      mode: 'Immediate',
      position: 'InteractiveArea',
      renderContent: () => <CallToActionPopup title={title} description={description} buttons={buttons} onClose={() => this.hidePopup()} />
    });
  }

  private hidePopup() {
    this.floatingManager.remove(this.popupInstance!);
  }

  private showOverlay(message: MessageData) {
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
            onClick={() => this.onCallToActionButtonClick}
            onClose={() => this.onOverlayCloseClick()}
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
    // TODO fire an event
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else {
      // @ts-ignore
      this.player.loadMedia({entryId: link});
    }
  }

  public addMessage(message: MessageData) {
    switch (this.store.getState().shell.playerSize) {
      case PLAYER_SIZE.TINY: {
        return;
      }
      case PLAYER_SIZE.EXTRA_SMALL:
      case PLAYER_SIZE.SMALL: {
        this.showOverlay(message);
        break;
      }
      case PLAYER_SIZE.MEDIUM:
      case PLAYER_SIZE.LARGE:
      case PLAYER_SIZE.EXTRA_LARGE: {
        if (message.showToast) {
          this.showPopup(message);
        } else {
          this.showOverlay(message);
        }
      }
    }
  }

  public removeMessage() {
    if (this.popupInstance) {
      this.hidePopup();
    } else {
      this.onOverlayCloseClick();
    }
  }
}

export {CallToActionManager};
