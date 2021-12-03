import { MouseEventHandler, TouchEventHandler, useState } from 'react';
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

  const onTouch: TouchEventHandler = (e) => {
    if (e.type === 'touchstart') {
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
      const currentTouch = getTouch(e.changedTouches, touch!.identifier);

      if (currentTouch !== null) {
        const deltaY = currentTouch.clientY - touch!.clientY;
        setTouch(currentTouch);

        if (onScroll) {
          onScroll(deltaY);
        }
      }
    }
  };

  return (
    <div
      className={styles.touchPad}
      onMouseDown={onMouse}
      onMouseMove={onMouse}
      onClick={onMouse}
      onTouchStart={onTouch}
      onTouchMove={onTouch}
    />
  );
};

export default TouchPad;
