import React, { ReactNode, useState, MouseEventHandler, useCallback, useRef, useEffect } from 'react';
import styles from './index.less';
import { min, max } from 'lodash';
import { TouchEventHandler, WheelEventHandler } from '@umijs/renderer-react/node_modules/@types/react';
import { getTouch } from '@/utils/touch';

export interface SliderProps {
  icon?: ReactNode
  onChange?: (percent: number) => void
  initialValue?: number
}

const Slider: React.FC<SliderProps> = ({ icon, initialValue = 0.5 }) => {
  const [value, setValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [touch, setTouch] = useState<Touch | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onResize() {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    }

    setTimeout(() => onResize(), 0);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, []);

  function ensureRange(num: number): number {
    return max([0, min([1, num])]) as number;
  }

  function calculatePercentage(clientY: number) {
    if (!rect) {
      return value;
    }

    return ensureRange(1 - ((clientY - rect.top) / rect.height));
  }

  const mouseEventHandler: MouseEventHandler = useCallback((e) => {
    e.preventDefault();
    if (e.type === 'mousedown') {
      if (e.button !== 0) {
        return;
      }
      // Mousedown Event
      setDragging(true);
      setValue(calculatePercentage(e.clientY));
      window.addEventListener('mouseup', (e1) => {
        setDragging(false);
      }, {
        once: true
      });
    } else if (e.type === 'mousemove') {
      if (dragging) {
        setValue(calculatePercentage(e.clientY));
      }
    }
  }, [dragging]);

  const onTouch: TouchEventHandler = (e) => {
    if (e.type === 'touchstart') {
      // 只允许单点触控
      if (touch) {
        return;
      }

      const touch1 = e.changedTouches.item(0) as Touch;

      setTouch(touch1);
      setValue(calculatePercentage(touch1.clientY));

      window.addEventListener('touchend', () => {
        setTouch(null);
      }, {once: true});
    } else if (e.type === 'touchmove') {
      if (!touch) {
        return
      }

      const newTouch = getTouch(e.changedTouches, touch.identifier);

      if (!newTouch) {
        return;
      }

      setValue(calculatePercentage(newTouch.clientY));
      setTouch(newTouch);
    }
  };

  const onWheel: WheelEventHandler = (e) => {
    e.preventDefault();
    setValue(v => ensureRange(v + (e.deltaY > 0 ? -1 : 1) * 0.1));
  }

  return <div className={styles.slider}>
    <div className={styles.back}
     onMouseDown={mouseEventHandler}
     onMouseMove={mouseEventHandler}
     onTouchStart={onTouch}
     onTouchMove={onTouch}
     onWheel={onWheel}
     ref={ref}
     >
      <div className={styles.front} style={{
        height: `${value * 100}%`
      }}></div>
    </div>
    <div className={styles.icon}>{icon}</div>
  </div>;
};

export default Slider;
