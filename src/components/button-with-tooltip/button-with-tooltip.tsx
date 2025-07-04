import {h} from 'preact';

import {useState, useEffect} from 'preact/hooks';
import {Button, ButtonType} from '@playkit-js/common/dist/components/button';
interface ButtonWithTooltipProps {
  type: ButtonType;
  label: string;
  focusOnMount?: boolean;
  onClick: () => void;
  className?: string;
}

const ButtonWithTooltip = ({type, label, focusOnMount, onClick, className}: ButtonWithTooltipProps) => {
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  const [isFinalized, setIsFinalized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const onClickWrapper = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    if (!isFinalized && buttonRef) {
      setIsFinalized(true);

      const textElement = buttonRef.children[0] as HTMLElement;
      setShowTooltip(textElement.offsetWidth < textElement.scrollWidth);
    }
  });

  if (!isFinalized) {
    return (
      <div aria-hidden="true">
        <Button type={type} setRef={(ref: HTMLButtonElement) => setButtonRef(ref)} className={className}>
          {label}
        </Button>
      </div>
    );
  }

  return showTooltip ? (
    <Button
      tabIndex={0}
      key={'finalized'}
      type={type}
      tooltip={{label}}
      onClick={onClickWrapper}
      disabled={false}
      focusOnMount={focusOnMount}
      className={className}>
      {label}
    </Button>
  ) : (
    <Button tabIndex={0} key={'finalized'} type={type} onClick={onClickWrapper} disabled={false} focusOnMount={focusOnMount} className={className}>
      {label}
    </Button>
  );
};

export {ButtonWithTooltip};
