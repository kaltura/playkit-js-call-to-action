import {h} from 'preact';

// @ts-expect-error - TS2305: Module "@playkit-js/kaltura-player-js" has no exported member core
import {KalturaPlayer, ui, PlaykitUI, core} from '@playkit-js/kaltura-player-js';
const {PLAYER_SIZE} = ui.Components;

import {FloatingItem, FloatingManager} from '@playkit-js/ui-managers';

import {MessageButtonData, MessageData} from './types';
import {CallToActionOverlay, CallToActionPopup} from './components';
import {CallToActionEvents} from './events/events';

const {FakeEvent} = core;

const DESCRIPTION_LINES_SMALL = 2;
const DESCRIPTION_LINES_LARGE = 4;

class CallToActionManager {
  private player: KalturaPlayer;
  private eventManager: PlaykitUI.EventManager;
  private store: any;

  private removeActiveOverlay: null | (() => void) = null;
  private popupInstance: FloatingItem | null = null;
  private hideMessageTimeout = -1;
  private playQueued = false;
  private playOnClose = false;

  constructor(player: KalturaPlayer, eventManager: PlaykitUI.EventManager) {
    this.player = player;
    this.store = ui.redux.useStore();
    this.eventManager = eventManager;
  }

  public init() {
    this.eventManager.listen(this.player, this.player.Event.Core.PLAYING, () => {
      this.playQueued = false;
      if (this.removeActiveOverlay) {
        this.player.pause();
      }
    });
  }

  private get floatingManager(): FloatingManager {
    return (this.player.getService('floatingManager') as FloatingManager) || {};
  }

  private showPopup({
    title,
    description,
    buttons,
    onClose
  }: {
    title?: string;
    description?: string;
    buttons?: MessageButtonData[];
    onClose?: () => void;
  }) {
    this.popupInstance = this.floatingManager.add({
      label: 'Call To Action Popup',
      mode: 'Immediate',
      position: 'InteractiveArea',
      renderContent: () => (
        <CallToActionPopup
          title={title}
          description={description}
          buttons={buttons}
          onClick={(messageButtonData: MessageButtonData) => this.onCallToActionButtonClick(messageButtonData)}
          onClose={() => {
            this.hidePopup();
            onClose && onClose();
          }}
        />
      )
    });
  }

  private hidePopup() {
    this.floatingManager.remove(this.popupInstance!);
    this.popupInstance = null;
  }

  private showOverlay(message: MessageData, descriptionLines: number, onClose?: () => void) {
    if (!this.player.paused || this.playQueued) {
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
            onClick={(messageButtonData: MessageButtonData) => this.onCallToActionButtonClick(messageButtonData)}
            onClose={() => {
              this.onOverlayCloseClick();
              onClose && onClose();
            }}
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
      this.playQueued = true;
      this.player.play();
      this.playOnClose = false;
    }
  }

  private onCallToActionButtonClick(messageButtonData: MessageButtonData) {
    const {link} = messageButtonData;
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else {
      // TODO use updated player types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.player.loadMedia({entryId: link});
    }

    this.player.dispatchEvent(new FakeEvent(CallToActionEvents.CALL_TO_ACTION_BUTTON_CLICK, messageButtonData));
  }

  private hideMessageAfterDuration(duration?: number) {
    if (duration) {
      this.hideMessageTimeout = window.setTimeout(() => {
        this.removeMessage();
        this.hideMessageTimeout = -1;
      }, duration * 1000);
    }
  }

  public addMessage({message, duration, onClose}: {message: MessageData; duration?: number; onClose: () => void}) {
    switch (this.store.getState().shell.playerSize) {
      case PLAYER_SIZE.TINY: {
        return;
      }
      case PLAYER_SIZE.EXTRA_SMALL:
      case PLAYER_SIZE.SMALL: {
        this.showOverlay(message, DESCRIPTION_LINES_SMALL, onClose);
        this.hideMessageAfterDuration(duration);
        break;
      }
      case PLAYER_SIZE.MEDIUM:
      case PLAYER_SIZE.LARGE:
      case PLAYER_SIZE.EXTRA_LARGE: {
        if (message.showToast) {
          this.showPopup({...message, onClose});
          if (message.timing.showOnEnd) {
            this.hideMessageAfterDuration(duration);
          }
        } else {
          this.showOverlay(message, DESCRIPTION_LINES_LARGE, onClose);
          this.hideMessageAfterDuration(duration);
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

    if (this.hideMessageTimeout !== -1) {
      window.clearTimeout(this.hideMessageTimeout);
      this.hideMessageTimeout = -1;
    }
  }

  public reset() {
    this.removeMessage();
    this.removeActiveOverlay = null;
    this.popupInstance = null;
    this.hideMessageTimeout = -1;
    this.playQueued = false;
    this.playOnClose = false;
  }
}

export {CallToActionManager};
