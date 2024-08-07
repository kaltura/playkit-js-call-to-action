import {ComponentChildren} from 'preact';
import {useEffect, useRef, useCallback} from 'preact/hooks';

interface FocusTrapProps {
  children: ComponentChildren;
  active: boolean;
}

const FOCUSABLE_ELEMENTS_QUERY = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

const FocusTrap = ({children, active}: FocusTrapProps) => {
  const trapRef = useRef(null);

  const setupFocusTrap = useCallback(() => {
    if (!active) return;

    const trapElement = trapRef.current;
    if (!trapElement) return;

    const focusableElements = (trapElement as HTMLElement).querySelectorAll(FOCUSABLE_ELEMENTS_QUERY);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: any) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const observer = new MutationObserver(() => {
      setupFocusTrap();
    });

    const trapElement = trapRef.current;
    if (trapElement) {
      observer.observe(trapElement, {
        childList: true,
        subtree: true
      });
    }

    setupFocusTrap();

    return () => {
      if (trapElement) {
        observer.disconnect();
      }
    };
  }, [active, setupFocusTrap]);

  return <div ref={trapRef}>{children}</div>;
};

export {FocusTrap};
