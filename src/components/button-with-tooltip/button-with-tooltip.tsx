import {useState, useEffect} from 'preact/hooks';
import {Button, ButtonType} from '@playkit-js/common';

interface ButtonWithTooltipProps {
  type: ButtonType;
  label: string;
  onClick: () => void;
}

const ButtonWithTooltip = ({type, label, onClick}: ButtonWithTooltipProps) => {
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>();

  const [isFinalized, setIsFinalized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    if (!isFinalized && buttonRef) {
      setIsFinalized(true);

      const textElement = buttonRef.children[0] as HTMLElement;
      setShowTooltip(textElement.offsetWidth < textElement.scrollWidth);
    }
  });

  if (!isFinalized) {
    return (
      <Button type={type} tooltip={{label}} onClick={onClick} setRef={(ref: HTMLButtonElement) => setButtonRef(ref)} disabled={false}>
        {label}
      </Button>
    );
  }

  return showTooltip ? (
    <Button type={type} tooltip={{label}} onClick={onClick} disabled={false}>
      {label}
    </Button>
  ) : (
    <Button type={type} onClick={onClick} disabled={false}>
      {label}
    </Button>
  );
};

export {ButtonWithTooltip};
