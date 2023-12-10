enum MessageButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

interface MessageButtonData {
  label: string;
  link: string;
  type: MessageButtonType;
}

interface MessageData {
  title?: string;
  description?: string;
  showToast?: boolean;
  buttons?: MessageButtonData[];
  timing: {
    showMessageOnSeek?: boolean;
    duration?: number;
    showOnStart?: boolean;
    showOnEnd?: boolean;
    timeFromStart?: number;
    timeFromEnd?: number;
  };
}

export {MessageData, MessageButtonData, MessageButtonType};
