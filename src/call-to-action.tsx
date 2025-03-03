import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';
import {CallToActionConfig, MessageData} from './types';
import {CallToActionManager} from './call-to-action-manager';
import {MetadataLoader} from './providers/metadata-loader';
import {KalturaMetadata} from './providers/response-types/kaltura-metadata';
import {XMLParser} from 'fast-xml-parser';

interface MessageDataWithTracking extends MessageData {
  wasShown?: boolean;
  wasDismissed?: boolean;
}

class CallToAction extends BasePlugin<CallToActionConfig> {
  protected static defaultConfig: CallToActionConfig = {
    messages: []
  };
  private callToActionManager: CallToActionManager;
  private messages: MessageDataWithTracking[] = [];

  private messagesFiltered = false;
  private activeMessage: MessageData | null = null;
  private activeMessageEndTime = -1;

  constructor(name: string, player: KalturaPlayer, config: CallToActionConfig) {
    super(name, player, config);
    this.callToActionManager = new CallToActionManager(player, this.eventManager);
  }

  static isValid() {
    return true;
  }

  protected async loadMedia(): Promise<void> {
    if (!this.messagesFiltered || this.config.metadataMessages) {
      await this.filterMessages();
      this.messagesFiltered = true;
    }

    if (this.messages.length) {
      this.eventManager.listenOnce(this.player, this.player.Event.Core.FIRST_PLAYING, () => {
        this.sortMessages();
        this.callToActionManager.init();
        this.eventManager.listen(this.player, this.player.Event.Core.TIME_UPDATE, () => this.onTimeUpdate());
        this.eventManager.listen(this.player, this.player.Event.Core.SEEKED, () => this.onSeeked());
      });
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

    if (this.activeMessage) {
      this.callToActionManager.removeMessage();
      this.activeMessageEndTime = -1;
      this.activeMessage = null;
    }

    for (const message of this.messages) {
      if (message.timing.redisplayMessage || !message.wasDismissed) {
        message.wasShown = false;
      }
    }

    for (let i = this.messages.length - 1; i >= 0; --i) {
      const message = this.messages[i];

      if (message.wasShown || !this.isMessageInTimeRange(message)) {
        continue;
      }

      const remainingDuration = this.getRemainingDuration(message);
      if (remainingDuration) {
        this.activeMessageEndTime = currentTime + remainingDuration;
      }

      this.showMessage(message, remainingDuration);
      break;
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
      this.activeMessage = null;
    }
  }

  private sortMessages() {
    this.messages.sort((messageA: MessageData, messageB: MessageData) => this.compareMessagesByTiming(messageA, messageB));
  }

  private async getMetadataOnEntry(entryId: string | undefined, metadataProfileId: number | undefined): Promise<KalturaMetadata> {
    if (!entryId || !metadataProfileId) {
      return;
    }
    const ks = this.player.config.session?.ks || '';
    const data: Map<string, any> = await this.player.provider.doRequest([{loader: MetadataLoader, params: {entryId, metadataProfileId}}], ks);
    return this.parseDataFromResponse(data);
  }

  private parseDataFromResponse(data: Map<string, any>): KalturaMetadata {
    let kalturaMetadata;
    if (data) {
      if (data.has(MetadataLoader.id)) {
        const metadataLoader = data.get(MetadataLoader.id);
        kalturaMetadata = metadataLoader?.response?.metadata;
      }
    }
    return kalturaMetadata;
  }

  private replaceMetadataFields(metadataMessages: any, metadataOnEntry: KalturaMetadata) {
    if (metadataOnEntry?.xml) {
      const parser = new XMLParser();
      const parsedResult = parser.parse(metadataOnEntry.xml);
      const metadata = parsedResult.metadata;
      return metadataMessages.map(item => ({
        ...item,
        title: metadata[item.title] || '',
        description: metadata[item.description] || '',
        buttons: item.buttons.map(button =>
          metadata[button.label] && metadata[button.link]
            ? {
                ...button,
                label: String(metadata[button.label]),
                link: String(metadata[button.link])
              }
            : {
                ...button,
                label: '',
                link: ''
              }
        )
      }));
    }
    return [];
  }

  private async filterMessages() {
    let mergedMessages = this.config.messages;
    if (this.config?.metadataMessages) {
      const metadataOnEntry = await this.getMetadataOnEntry(this.player.sources?.id, this.config?.metadataProfileId);
      const messagesWithMetadata = this.replaceMetadataFields(this.config.metadataMessages, metadataOnEntry);
      mergedMessages = [...messagesWithMetadata, ...this.config.messages];
    }
    this.messages = mergedMessages
      .map(message => {
        const {buttons, timing} = message;

        if (timing?.timeFromStart !== undefined && timing?.timeFromStart < 0) {
          timing.timeFromStart = undefined;
        }
        if (timing?.timeFromEnd !== undefined && timing?.timeFromEnd < 0) {
          timing.timeFromEnd = undefined;
        }

        return {
          ...message,
          timing,
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
            message.timing.timeFromStart !== undefined ||
            message.timing.timeFromEnd !== undefined);
        const durationValid =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message.timing && (message.timing.duration === undefined || message.timing.duration > 0 || message.timing.duration === '');
        const contentValid = message.description || message.title || message.buttons.length;

        return durationValid && timingValid && contentValid;
      });
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
    const messageAStartTime = messageA.timing.timeFromEnd !== undefined ? videoDuration - messageA.timing.timeFromEnd : messageA.timing.timeFromStart;
    const messageBStartTime = messageB.timing.timeFromEnd !== undefined ? videoDuration - messageB.timing.timeFromEnd : messageB.timing.timeFromStart;

    return messageAStartTime! - messageBStartTime!;
  }

  private showMessage(message: MessageDataWithTracking, duration?: number) {
    this.activeMessage = message;
    message.wasShown = true;
    const ctaSource = this.config.metadataMessages?.includes(message) ? 'metadata_based' : 'player_level';

    this.callToActionManager.removeMessage();
    this.callToActionManager.addMessage({
      message,
      duration,
      onClose: () => {
        message.wasDismissed = true;
      },
      ctaSource
    });
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
    if (showOnEnd) {
      return currentTime < duration ? 0 : duration;
    }
    if (timeFromStart !== undefined) {
      return timeFromStart + duration - currentTime;
    }
    if (timeFromEnd !== undefined) {
      return videoDuration - timeFromEnd + duration - currentTime;
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
    if (timeFromStart !== undefined) return currentTime >= timeFromStart && (!duration || currentTime <= timeFromStart + duration);
    if (timeFromEnd !== undefined)
      return currentTime >= videoDuration - timeFromEnd && (!duration || currentTime <= videoDuration - timeFromEnd + duration);
  }

  public reset() {
    this.eventManager.removeAll();
    this.callToActionManager.reset();

    this.activeMessage = null;
    this.activeMessageEndTime = -1;
    for (const message of this.messages) {
      message.wasShown = false;
      message.wasDismissed = false;
    }
  }
}

export {CallToAction};
