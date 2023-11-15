// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';
import {CallToActionConfig, MessageData} from './types';

import {ContribServices, FloatingItem, FloatingPositions, FloatingUIModes} from '@playkit-js/common/dist/ui-common';

import {CallToActionPopup} from './components';

// import {AudioPlayerView, AudioPlayerUI} from './components';

interface MessageVisibilityData {
  wasShown?: boolean;
}

class CallToAction extends BasePlugin<CallToActionConfig> {
  private contribServices: ContribServices;
  private popupInstance: FloatingItem | null = null;

  protected static defaultConfig: CallToActionConfig = {
    messages: []
  };

  messages: (MessageData & MessageVisibilityData)[] = [];
  //activeMessage: MessageData | null = null;
  activeMessageEndTime = -1;
  //activeMessageStartTime = -1;

  constructor(name: string, player: KalturaPlayer, config: CallToActionConfig) {
    super(name, player, config);

    this.contribServices = ContribServices.get({kalturaPlayer: player});
  }

  getUIComponents(): any[] {
    return this.contribServices.register();
  }

  static isValid() {
    return true;
  }

  protected loadMedia(): void {
    this.filterMessages();

    if (this.messages.length) {
      const startMessage = this.config.messages.find(message => message.timing.showOnStart);
      if (startMessage) {
        this.eventManager.listen(this.player, 'firstplaying', () => {
          // TODO will this be called on start over as well ?
          const {title, description} = startMessage;
          this.showPopup({title, description});

          if (startMessage.timing.duration) {
            // TODO
            // @ts-ignore
            this.activeMessageEndTime = this.player.currentTime + startMessage.timing.duration;
          }
        });
      }

      const midMessages = this.messages.filter(message => message.timing.timeFromEnd > -1 || message.timing.timeFromStart > -1);

      this.eventManager.listen(this.player, 'timeupdate', () => {
        // TODO
        // @ts-ignore
        if (this.activeMessageEndTime !== -1 && this.player.currentTime >= this.activeMessageEndTime) {
          this.hidePopup();
          this.activeMessageEndTime = -1;
        }

        // if there is a message that should be shown, show it
        for (const message of midMessages) {
          const {title, description} = message;
          const {timeFromStart, timeFromEnd, duration} = message.timing;

          // TODO
          // @ts-ignore
          const timeFromStartReached = timeFromStart && this.player.currentTime >= timeFromStart;

          // TODO
          // @ts-ignore
          const timeFromEndReached = timeFromEnd && message.timing.timeFromEnd >= this.player.duration - this.player.currentTime;

          if (!message.wasShown && (timeFromStartReached || timeFromEndReached)) {
            message.wasShown = true;
            console.log('>>> showing message ' + message?.title);

            this.showPopup({title, description});

            // TODO
            // @ts-ignore
            this.activeMessageEndTime = this.player.currentTime + duration;
            break;
          }
        }
      });

      const endMessage = this.config.messages.find(message => message.timing.showOnEnd);
      if (endMessage) {
        const {title, description} = endMessage;

        this.eventManager.listen(this.player, 'ended', () => {
          this.showPopup({title, description});

          if (endMessage.timing.duration) {
            setTimeout(() => {
              this.hidePopup();
            }, endMessage.timing.duration * 1000);
          }
        });
      }
    }
  }

  filterMessages() {
    this.messages = this.config.messages.filter(message => {
      // TODO
      const buttonsValid =
        !message.buttons ||
        !message.buttons.length ||
        !!message.buttons.filter(({label, link}) => {
          return label && link;
        }).length;
      const timingValid =
        message.timing &&
        (message.timing.showOnEnd || message.timing.showOnStart || message.timing.timeFromEnd !== -1 || message.timing.timeFromStart !== -1);
      const durationValid = !message.timing.duration || message.timing.duration > 0;

      return message.description && message.title && durationValid && timingValid && buttonsValid;
    });
  }

  showOverlay() {
    // TODO show overlay on small sizes
  }

  hideOverlay() {}

  showPopup({title, description, buttons}: {title?: string; description?: string; buttons?: Array<{label: string; link: string}>}) {
    this.popupInstance = this.contribServices.floatingManager.add({
      label: 'Call To Action Popup',
      mode: FloatingUIModes.Immediate,
      position: FloatingPositions.InteractiveArea,
      renderContent: () => <CallToActionPopup title={title} description={description} onClose={() => this.hidePopup()} />
    });
  }

  hidePopup() {
    if (this.popupInstance) {
      this.contribServices.floatingManager.remove(this.popupInstance);
    }
  }

  reset() {
    // TODO reset wasShown
  }
}

export {CallToAction};
