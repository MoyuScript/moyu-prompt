import {
  MouseEventHandler,
  TouchEventHandler,
  useState,
  useRef,
  useEffect,
} from 'react';
import React from 'react';
import styles from './index.less';
import { getTouch } from '@/utils/touch';

export interface TouchPadProps {
  onTap?: () => void;
  onScroll?: (deltaY: number) => void;
}

const TouchPad: React.FC<TouchPadProps> = ({ onScroll, onTap }) => {
  const [touch, setTouch] = useState<null | React.Touch>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseMoving, setMouseMoving] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);

  const onMouse = (e: MouseEvent) => {
    e.preventDefault();

    if (e.type === 'mousedown') {
      if (e.button === 0) {
        const startTime = performance.now();
        setMouseDown(true);
        window.addEventListener(
          'mouseup',
          () => {
            setMouseMoving(false);
            setMouseDown(false);
            const endTime = performance.now();

            if (endTime - startTime <= 200 || !mouseMoving) {
              // click
              if (onTap) {
                onTap();
              }
            }
          },
          { once: true },
        );
      }
    } else if (e.type === 'mousemove') {
      if (mouseDown) {
        setMouseMoving(true);
        if (onScroll) {
          onScroll(e.movementY);
        }
      }
    }
  };

  const onTouch = (e: TouchEvent) => {
    e.preventDefault();
    if (e.type === 'touchstart') {
      const startTime = performance.now();

      if (touch === null) {
        setTouch(e.touches.item(0));
        window.addEventListener(
          'touchend',
          () => {
            setMouseMoving(false);
            const endTime = performance.now();

            if (endTime - startTime <= 200) {
              // click
              navigator.vibrate([50]);
              if (onTap) {
                onTap();
              }
            }
            setTouch(null);
          },
          { once: true },
        );
      }
    } else if (e.type === 'touchmove') {
      if (!touch) {
        return;
      }

      const currentTouch = getTouch(e.changedTouches, touch.identifier);

      if (currentTouch !== null) {
        const deltaY = currentTouch.clientY - touch!.clientY;

        if (deltaY !== 0) {
          setMouseMoving(true);
        }
        setTouch(currentTouch);

        if (onScroll) {
          onScroll(deltaY);
        }
      }
    }
  };

  useEffect(() => {
    if (padRef.current) {
      const $ = padRef.current;
      $.addEventListener('mousedown', onMouse, { passive: false });
      $.addEventListener('mousemove', onMouse, { passive: false });
      $.addEventListener('touchstart', onTouch, { passive: false });
      $.addEventListener('touchmove', onTouch, { passive: false });
    }

    return () => {
      if (padRef.current) {
        const $ = padRef.current;
        $.removeEventListener('mousedown', onMouse);
        $.removeEventListener('mousemove', onMouse);
        $.removeEventListener('touchstart', onTouch);
        $.removeEventListener('touchmove', onTouch);
      }
    };
  }, [padRef.current, touch, mouseDown, mouseMoving]);

  return <div className={styles.touchPad} ref={padRef} />;
};

export default TouchPad;
