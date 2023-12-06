import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';
import {ContribServices} from '@playkit-js/common/dist/ui-common';

import {CallToActionConfig, MessageData} from './types';
import {CallToActionManager} from './call-to-action-manager';

interface MessageVisibilityData {
  wasShown?: boolean;
}

class CallToAction extends BasePlugin<CallToActionConfig> {
  protected static defaultConfig: CallToActionConfig = {
    messages: []
  };
  private callToActionManager: CallToActionManager;
  private messages: (MessageData & MessageVisibilityData)[] = [];

  private contribServices: ContribServices;

  private messagesFiltered = false;

  constructor(name: string, player: KalturaPlayer, config: CallToActionConfig) {
    super(name, player, config);
    this.contribServices = ContribServices.get({kalturaPlayer: this.player});
    this.callToActionManager = new CallToActionManager(player, this.contribServices.floatingManager);
  }

  getUIComponents(): any[] {
    return this.contribServices.register();
  }

  static isValid() {
    return true;
  }

  protected loadMedia(): void {
    if (!this.messagesFiltered) {
      this.filterMessages();
      this.messagesFiltered = true;
    }

    if (this.messages.length) {
      const startMessage = this.messages.find(message => message.timing.showOnStart);
      if (startMessage) {
        const {duration} = startMessage.timing;
        this.eventManager.listen(this.player, 'firstplaying', () => {
          this.showMessage(startMessage);
        });
      }

      const midMessages = this.messages.filter(message => message.timing.timeFromEnd > -1 || message.timing.timeFromStart > -1);

      this.eventManager.listen(this.player, 'timeupdate', () => {
        // if there is a message that should be shown, show it
        for (const message of midMessages) {
          const {timeFromStart, timeFromEnd, duration} = message.timing;

          // TODO use updated player types
          // @ts-ignore
          const timeFromStartReached = timeFromStart && this.player.currentTime >= timeFromStart;

          // TODO use updated player types
          // @ts-ignore
          const timeFromEndReached = timeFromEnd && timeFromEnd >= this.player.duration - this.player.currentTime;

          if (!message.wasShown && (timeFromStartReached || timeFromEndReached)) {
            message.wasShown = true;
            this.showMessage(message);
            break;
          }
        }
      });

      const endMessage = this.messages.find(message => message.timing.showOnEnd);
      if (endMessage) {
        this.eventManager.listen(this.player, 'ended', () => {
          this.showMessage(endMessage);
        });
      }
    }
  }

  filterMessages() {
    this.messages = this.config.messages
      .map(message => {
        const {buttons} = message;
        return {
          ...message,
          buttons: buttons
            ? buttons.filter(button => {
                return button.label && typeof button.label === 'string' && button.link && typeof button.link === 'string';
              })
            : []
        };
      })
      .filter(message => {
        const timingValid =
          message.timing &&
          (message.timing.showOnStart === true ||
            message.timing.showOnEnd === true ||
            message.timing.timeFromStart >= 0 ||
            message.timing.timeFromEnd >= 0);
        const durationValid = message.timing && (!message.timing.duration || message.timing.duration > 0);
        const contentValid = message.description || message.title || message.buttons.length;

        return durationValid && timingValid && contentValid;
      });
  }

  showMessage(message: MessageData) {
    this.callToActionManager.addMessage(message);
  }

  reset() {
    this.callToActionManager.removeMessage();
    for (const message of this.messages) {
      message.wasShown = false;
    }
  }
}

export {CallToAction};
