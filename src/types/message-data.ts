interface MessageData {
  title: string;
  description: string;
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
