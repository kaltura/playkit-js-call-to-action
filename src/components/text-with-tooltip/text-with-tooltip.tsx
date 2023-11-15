import * as styles from './text-with-tooltip.scss';

import {useState, useRef, useLayoutEffect} from 'preact/hooks';

// TODO
// @ts-ignore
const {Tooltip} = window.KalturaPlayer.ui.components;

const TextWithTooltip = ({text, numberOfLines}: {text: string; numberOfLines: number}) => {
  const comparisonTextRef = useRef(null);
  const textRef = useRef(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  useLayoutEffect(() => {
    if (textRef?.current && comparisonTextRef?.current) {
      setIsFinalized(true);

      // TODO
      // @ts-ignore
      const textHeight = textRef?.current?.getBoundingClientRect().height;

      // TODO
      // @ts-ignore
      const comparisonTextHeight = comparisonTextRef?.current?.getBoundingClientRect().height;

      // TODO
      // @ts-ignore
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

  // return (
  //     !isFinalized ?

  //     <div className={styles.TextWithTooltip}>
  //     <div ref={textRef} style={{'-webkit-line-clamp': numberOfLines}} className={styles.expandableText}>
  //     {text}
  //     </div>
  //     {!isFinalized ? (
  //         <div ref={comparisonTextRef} style={{'-webkit-line-clamp': numberOfLines + 1}} className={styles.expandableText}>
  //         {text}
  //         </div>
  //         ) : undefined}
  //         </div>
  //         );

  //         return <div className={styles.textWithTooltip}>
  //         {
  //             !isFinalized ?
  //             <>
  //             <div ref={textRef} style={{'-webkit-line-clamp': numberOfLines}} className={styles.expandableText}>
  //             {text}
  //             </div>
  //             </> : <></>
  //         }
  //         </div>
};

export {TextWithTooltip};
