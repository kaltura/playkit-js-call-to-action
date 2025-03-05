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
    redisplayMessage?: boolean;
    duration?: number;
    showOnStart?: boolean;
    showOnEnd?: boolean;
    timeFromStart?: number;
    timeFromEnd?: number;
  };
  isMetadataBased?: boolean;
}

export {MessageData, MessageButtonData, MessageButtonType};
