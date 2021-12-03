import React, {
  ReactNode,
  useState,
  MouseEventHandler,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import styles from './index.less';
import { min, max } from 'lodash';
import {
  TouchEventHandler,
  WheelEventHandler,
} from '@umijs/renderer-react/node_modules/@types/react';
import { getTouch } from '@/utils/touch';

export interface SliderProps {
  icon?: ReactNode;
  onChange?: (percent: number) => void;
  value?: number;
}

const Slider: React.FC<SliderProps> = ({ icon, value = 0.5, onChange }) => {
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
    };
  }, []);

  function ensureRange(num: number): number {
    return max([0, min([1, num])]) as number;
  }

  function calculatePercentage(clientY: number) {
    if (!rect) {
      return value;
    }

    return ensureRange(1 - (clientY - rect.top) / rect.height);
  }

  const mouseEventHandler: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      if (e.type === 'mousedown') {
        if (e.button !== 0) {
          return;
        }
        // Mousedown Event

        setDragging(true);

        const perc = calculatePercentage(e.clientY);
        if (onChange) {
          onChange(perc);
        }

        window.addEventListener(
          'mouseup',
          (e1) => {
            setDragging(false);
          },
          {
            once: true,
          },
        );
      } else if (e.type === 'mousemove') {
        if (dragging) {
          const perc = calculatePercentage(e.clientY);

          if (onChange) {
            onChange(perc);
          }
        }
      }
    },
    [dragging],
  );

  const onTouch: TouchEventHandler = (e) => {
    if (e.type === 'touchstart') {
      // 只允许单点触控
      if (touch) {
        return;
      }

      const touch1 = e.changedTouches.item(0) as Touch;

      setTouch(touch1);
      const perc = calculatePercentage(touch1.clientY);

      if (onChange) {
        onChange(perc);
      }

      window.addEventListener(
        'touchend',
        () => {
          setTouch(null);
        },
        { once: true },
      );
    } else if (e.type === 'touchmove') {
      if (!touch) {
        return;
      }

      const newTouch = getTouch(e.changedTouches, touch.identifier);

      if (!newTouch) {
        return;
      }

      const perc = calculatePercentage(newTouch.clientY);

      if (onChange) {
        onChange(perc);
      }
      setTouch(newTouch);
    }
  };

  return (
    <div className={styles.slider}>
      <div
        className={styles.back}
        onMouseDown={mouseEventHandler}
        onMouseMove={mouseEventHandler}
        onTouchStart={onTouch}
        onTouchMove={onTouch}
        ref={ref}
      >
        <div
          className={styles.front}
          style={{
            height: `${value * 100}%`,
          }}
        ></div>
      </div>
      <div className={styles.icon}>{icon}</div>
    </div>
  );
};

export default Slider;
