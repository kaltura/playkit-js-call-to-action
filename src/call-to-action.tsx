// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';

import {CallToActionConfig, MessageData} from './types';
import {CallToActionPopup} from './components';
import {CallToActionManager} from './call-to-action-manager';

// import {AudioPlayerView, AudioPlayerUI} from './components';

interface MessageVisibilityData {
  wasShown?: boolean;
}

class CallToAction extends BasePlugin<CallToActionConfig> {
  private callToActionManager: CallToActionManager;

  protected static defaultConfig: CallToActionConfig = {
    messages: []
  };

  messages: (MessageData & MessageVisibilityData)[] = [];
  //activeMessage: MessageData | null = null;
  activeMessageEndTime = -1;
  //activeMessageStartTime = -1;

  constructor(name: string, player: KalturaPlayer, config: CallToActionConfig) {
    super(name, player, config);
    this.callToActionManager = new CallToActionManager(player);
  }

  // private get bannerManager(): BannerManager {
  //   return (this.player.getService('bannerManager') as BannerManager) || {};
  // }

  // private get toastManager(): ToastManager {
  //   return (this.player.getService('toastManager') as ToastManager) || {};
  // }

  // private get floatingManager(): FloatingManager {
  //   return (this.player.getService('floatingManager') as FloatingManager) || {};
  // }

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
          this.showMessage(startMessage);

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
          this.hideMessage();
          this.activeMessageEndTime = -1;
        }

        // if there is a message that should be shown, show it
        for (const message of midMessages) {
          const {title, description, buttons} = message;
          const {timeFromStart, timeFromEnd, duration} = message.timing;

          // TODO
          // @ts-ignore
          const timeFromStartReached = timeFromStart && this.player.currentTime >= timeFromStart;

          // TODO
          // @ts-ignore
          const timeFromEndReached = timeFromEnd && message.timing.timeFromEnd >= this.player.duration - this.player.currentTime;

          if (!message.wasShown && (timeFromStartReached || timeFromEndReached)) {
            message.wasShown = true;
            this.showMessage(message);

            // TODO
            // @ts-ignore
            this.activeMessageEndTime = this.player.currentTime + duration;
            break;
          }
        }
      });

      const endMessage = this.config.messages.find(message => message.timing.showOnEnd);
      if (endMessage) {
        const {title, description, buttons} = endMessage;

        this.eventManager.listen(this.player, 'ended', () => {
          this.showMessage(endMessage);

          if (endMessage.timing.duration) {
            setTimeout(() => {
              this.hideMessage();
            }, endMessage.timing.duration * 1000);
          }
        });
      }
    }
  }

  filterMessages() {
    this.messages = this.config.messages.filter(message => {
      let buttons = [];
      if (message.buttons?.length) {
        buttons = message.buttons.filter(({label, link}) => {
          return label && link;
        });
      }

      const timingValid =
        message.timing &&
        (message.timing.showOnEnd || message.timing.showOnStart || message.timing.timeFromEnd !== -1 || message.timing.timeFromStart !== -1);
      const durationValid = !message.timing.duration || message.timing.duration > 0;
      const contentValid = message.description || message.title || message.buttons.length;

      return durationValid && timingValid && contentValid;
    });
  }

  //showPopup({title, description, buttons}: {title: string; description: string; buttons: Array<{label: string; link: string}>}) {
  showMessage(message: MessageData) {
    // this.popupInstance = this.floatingManager.add({
    //   label: 'Call To Action Popup',
    //   mode: 'Immediate',
    //   position: 'InteractiveArea',
    //   renderContent: () => <CallToActionPopup title={title} description={description} buttons={buttons} onClose={() => this.hidePopup()} />
    // });
    // this.toastManager.add({
    //   title: 'aaa',
    //   text: 'aaa',
    //   icon: '',
    //   severity: 'Error',
    //   duration: 10000,
    //   onClick: () => {}
    // });
    // this.bannerManager.add({
    //   content: {
    //     text: 'aaaaaaaa'
    //   }
    // });
    this.callToActionManager.addMessage(message);
  }

  hideMessage() {
    this.callToActionManager.removeMessage();
  }

  reset() {
    // TODO reset wasShown
    this.activeMessageEndTime = -1;
    for (const message of this.messages) {
      message.wasShown = false;
    }
  }
}

export {CallToAction};
