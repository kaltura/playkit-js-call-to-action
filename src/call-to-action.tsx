import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';
import {ContribServices} from '@playkit-js/common/dist/ui-common';

import {CallToActionConfig, MessageData} from './types';
import {CallToActionManager} from './call-to-action-manager';

interface MessageDataWithTracking extends MessageData {
  wasShown?: boolean;
}

class CallToAction extends BasePlugin<CallToActionConfig> {
  protected static defaultConfig: CallToActionConfig = {
    messages: []
  };
  private callToActionManager: CallToActionManager;
  private messages: MessageDataWithTracking[] = [];
  private contribServices: ContribServices;
  private messagesFiltered = false;
  private activeMessage: MessageData | null = null;
  private activeMessageEndTime = -1;

  constructor(name: string, player: KalturaPlayer, config: CallToActionConfig) {
    super(name, player, config);
    this.contribServices = ContribServices.get({kalturaPlayer: this.player});
    this.callToActionManager = new CallToActionManager(player, this.contribServices.floatingManager);
  }

  public getUIComponents(): any[] {
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
      this.eventManager.listen(this.player, this.player.Event.Core.TIME_UPDATE, () => this.onTimeUpdate());
      this.eventManager.listen(this.player, this.player.Event.Core.SEEKED, () => this.onSeeked());
    }
  }

  private onTimeUpdate() {
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentTime = this.player.currentTime;

    this.hideActiveMessage();

    for (let i = this.messages.length - 1; i >= 0; --i) {
      const message = this.messages[i];

      if (this.activeMessage && this.compareMessagesByTiming(message, this.activeMessage) < 0) {
        break;
      }

      if (!message.wasShown && this.isMessageInTimeRange(message)) {
        const remainingDuration = this.getRemainingDuration(message);
        if (remainingDuration) {
          this.activeMessageEndTime = currentTime + remainingDuration;
        }
        this.showMessage(message, remainingDuration);
        break;
      }
    }
  }

  private onSeeked() {
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentTime = this.player.currentTime;

    this.hideActiveMessage();

    for (const message of this.messages) {
      if (message.timing.showMessageOnSeek) {
        message.wasShown = false;
      }
    }

    for (let i = this.messages.length - 1; i >= 0; --i) {
      const message = this.messages[i];

      if (message.wasShown || !this.isMessageInTimeRange(message)) {
        continue;
      }

      if (!message.timing.duration) {
        if (!this.callToActionManager.isOverlayMessage(message)) {
          this.showMessage(message);
          break;
        }
      } else {
        const remainingDuration = this.getRemainingDuration(message);
        if (remainingDuration) {
          this.activeMessageEndTime = currentTime + remainingDuration;
          this.showMessage(message, remainingDuration);
          break;
        }
      }
    }
  }

  private hideActiveMessage() {
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentTime = this.player.currentTime;

    if (
      this.activeMessage &&
      ((this.activeMessageEndTime !== -1 && this.activeMessageEndTime <= currentTime) ||
        this.compareMessagesByTiming({timing: {timeFromStart: currentTime}}, this.activeMessage) < 0)
    ) {
      this.callToActionManager.removeMessage();
      this.activeMessageEndTime = -1;
    }
  }

  private filterMessages() {
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
            (message.timing.timeFromStart !== undefined && message.timing.timeFromStart >= 0) ||
            (message.timing.timeFromEnd !== undefined && message.timing.timeFromEnd >= 0));
        const durationValid = message.timing && (!message.timing.duration || message.timing.duration > 0);
        const contentValid = message.description || message.title || message.buttons.length;

        return durationValid && timingValid && contentValid;
      })
      .sort((messageA: MessageData, messageB: MessageData) => this.compareMessagesByTiming(messageA, messageB));
  }

  private compareMessagesByTiming(messageA: MessageData, messageB: MessageData) {
    if (messageA.timing.showOnEnd || messageB.timing.showOnStart) {
      return 1;
    }
    if (messageA.timing.showOnStart || messageB.timing.showOnEnd) {
      return -1;
    }

    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const videoDuration = this.player.duration;
    const messageAStartTime = messageA.timing.timeFromEnd ? videoDuration - messageA.timing.timeFromEnd : messageA.timing.timeFromStart;
    const messageBStartTime = messageB.timing.timeFromEnd ? videoDuration - messageB.timing.timeFromEnd : messageB.timing.timeFromStart;

    return messageAStartTime! - messageBStartTime!;
  }

  private showMessage(message: MessageDataWithTracking, duration?: number) {
    this.activeMessage = message;
    message.wasShown = true;
    this.callToActionManager.addMessage(message, duration);
  }

  private getRemainingDuration(message: MessageData) {
    if (!message.timing.duration) return 0;

    const {showOnStart, timeFromStart, showOnEnd, timeFromEnd, duration} = message.timing;
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentTime = this.player.currentTime;
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const videoDuration = this.player.duration;

    if (showOnStart) {
      return duration - currentTime;
    }
    if (timeFromStart) {
      return timeFromStart + duration - currentTime;
    }
    if (timeFromEnd) {
      return videoDuration - timeFromEnd + duration - currentTime;
    }
    if (showOnEnd) {
      return currentTime < duration ? 0 : duration;
    }
  }

  private isMessageInTimeRange(message: MessageData) {
    const {showOnStart, timeFromStart, showOnEnd, timeFromEnd, duration} = message.timing;
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentTime = this.player.currentTime;
    // TODO use updated player types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const videoDuration = this.player.duration;

    if (showOnStart) return !duration || currentTime <= duration;
    if (showOnEnd) return currentTime === videoDuration;
    if (timeFromStart) return currentTime >= timeFromStart && (!duration || currentTime <= timeFromStart + duration);
    if (timeFromEnd) return currentTime >= videoDuration - timeFromEnd && (!duration || currentTime <= videoDuration - timeFromEnd + duration);
  }

  public reset() {
    this.activeMessage = null;
    this.activeMessageEndTime = -1;
    this.callToActionManager.removeMessage();
    for (const message of this.messages) {
      message.wasShown = false;
    }
  }
}

export {CallToAction};
