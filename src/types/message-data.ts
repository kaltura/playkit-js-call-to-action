interface MessageData {
  title: string;
  description: string;
  showToast: boolean;
  buttons: {label: string; link: string}[];
  timing: {
    duration: number;
    showOnStart: boolean;
    showOnEnd: boolean;
    timeFromStart: number;
    timeFromEnd: number;
  };
}

export {MessageData};
