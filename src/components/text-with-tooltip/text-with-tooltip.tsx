import {useState, useRef, useLayoutEffect} from 'preact/hooks';
import {ui} from '@playkit-js/kaltura-player-js';
const {Tooltip} = ui.Components;

import * as styles from './text-with-tooltip.scss';

const TextWithTooltip = ({text, numberOfLines}: {text: string; numberOfLines: number}) => {
  const comparisonTextRef = useRef(null);
  const textRef = useRef(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  useLayoutEffect(() => {
    if (textRef?.current && comparisonTextRef?.current) {
      setIsFinalized(true);
      // @ts-ignore
      const textHeight = textRef?.current?.getBoundingClientRect().height;
      // @ts-ignore
      const comparisonTextHeight = comparisonTextRef?.current?.getBoundingClientRect().height;
      setShowTooltip(textHeight < comparisonTextHeight);
    }
  }, [isFinalized]);

  const textElement = (
    <div ref={textRef} style={{'-webkit-line-clamp': numberOfLines}} className={styles.text}>
      {text}
    </div>
  );
  const comparisonTextElement = (
    <div ref={comparisonTextRef} style={{'-webkit-line-clamp': numberOfLines + 1}} className={styles.text}>
      {text}
    </div>
  );
  const content = !isFinalized ? (
    <>
      {textElement}
      {comparisonTextElement}
    </>
  ) : (
    textElement
  );

  if (!text) return <></>;

  return <div className={styles.textWithTooltip}>{showTooltip ? <Tooltip label={text}>{content}</Tooltip> : content}</div>;
};

export {TextWithTooltip};
