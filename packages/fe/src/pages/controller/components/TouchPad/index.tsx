import { MouseEventHandler, TouchEventHandler, useState, useRef, useEffect } from 'react';
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

  const onMouse: MouseEventHandler = (e) => {
    e.preventDefault();

    if (e.type === 'mousedown') {
      if (e.button === 0) {
        setMouseDown(true);
        window.addEventListener(
          'mouseup',
          () => {
            setMouseDown(false);

            // 延迟取消鼠标移动状态，用以区分点击
            setTimeout(() => setMouseMoving(false), 100);
          },
          { once: true },
        );
      }
    } else if (e.type === 'mousemove') {
      if (mouseDown) {
        if (!mouseMoving) {
          setMouseMoving(true);
        }
        if (onScroll) {
          onScroll(e.movementY);
        }
      }
    } else if (e.type === 'click') {
      if (onTap && !mouseMoving) {
        onTap();
      }
    }
  };

  const onTouch = (e: TouchEvent) => {
    e.preventDefault();
    if (e.type === 'touchstart') {
      navigator.vibrate([50]);
      if (touch === null) {
        setTouch(e.touches.item(0));

        window.addEventListener(
          'touchend',
          () => {
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
      $.addEventListener('touchstart', onTouch, {passive: false});
      $.addEventListener('touchmove', onTouch, {passive: false});
    }

    return () => {
      if (padRef.current) {
        const $ = padRef.current;
      $.removeEventListener('touchstart', onTouch);
      $.removeEventListener('touchmove', onTouch);
      }
    }
  }, [padRef.current])

  return (
    <div
      className={styles.touchPad}
      onMouseDown={onMouse}
      onMouseMove={onMouse}
      onClick={onMouse}
      ref={padRef}
    />
  );
};

export default TouchPad;
