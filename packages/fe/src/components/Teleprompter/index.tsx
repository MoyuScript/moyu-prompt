import { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { min, max } from 'lodash';

import styles from './index.less';

export interface TeleprompterController {
  scrollBy: (deltaY: number) => void
  start: () => void
  pause: () => void
  reset: () => void
}

export interface TeleprompterConfig {
  fontSize?: number
  speed?: number
  mirror?: boolean
  showMask?: boolean
  showProgress?: boolean
}

export interface TeleprompterProps extends TeleprompterConfig {
  children?: string
  switchScrollingStatusWhenTap?: boolean
  onControllerAvailable?: (controller: TeleprompterController) => void
  onProgress?: (progress: number) => void
  onEstimatedDurationUpdate?: (timeRemaining: number) => void
  onScrollingStatusChange?: (status: boolean) => void
}

const Teleprompter: React.FC<TeleprompterProps> = ({
  children,
  fontSize = 64,
  speed = 1,
  mirror = false,
  showMask = true,
  showProgress = true,
  switchScrollingStatusWhenTap = true,
  onControllerAvailable,
  onEstimatedDurationUpdate,
  onProgress,
  onScrollingStatusChange,
}) => {
  const [position, setPosition] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [height, setHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const dependencies = [position, height, fontSize, speed, mirror, children];

  const stepY = speed / 50;
  const progress = min([position / (height - window.innerHeight), 1]) as number;

  // 控制器初始化
  const controller: TeleprompterController = {
    scrollBy(deltaY) {
      setPosition(p => p + deltaY);
    },

    start() {
      setScrolling(true);
    },

    pause() {
      setScrolling(false);
    },

    reset() {
      controller.pause();
      setPosition(0);
    }
  };

  const scrollToPosition = useCallback((scroll: number): number => {
    if (mirror) {
      return (height - window.innerHeight) - scroll + (ref.current?.offsetTop || 0);
    } else {
      return scroll;
    }
  }, dependencies);

  const positionToScroll = useCallback((position: number): number => {
    if (mirror) {
      return (height - window.innerHeight) - position + (ref.current?.offsetTop || 0);
    } else {
      return position;
    }
  }, dependencies);

  useEffect(() => {
    if (onControllerAvailable) {
      onControllerAvailable(controller);
    }
  }, []);

  // 滚动控制
  useEffect(() => {
    let intervalId: NodeJS.Timer | null = null;

    function updatePosition() {
      if (intervalId) {
        setPosition(position => {
          if (position >= height - window.innerHeight) {
            // 结束
            controller.pause();
            return position;
          } else {
            return position + stepY;
          }
      });
      }
    }
    if (scrolling) {
      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = setInterval(updatePosition, 16);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    if (onScrollingStatusChange) {
      onScrollingStatusChange(scrolling);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [scrolling, ...dependencies]);

  // 预计时长计算
  function calculateEstimatedDuration(): number {
    return (height - window.innerHeight) * (16 / stepY);
  }
  useEffect(() => {

    if (onEstimatedDurationUpdate) {
      onEstimatedDurationUpdate(calculateEstimatedDuration());
    }
  }, dependencies);

  // 进度
  useEffect(() => {
    if (onProgress && ref.current) {
      onProgress(progress);
    }
  }, dependencies);

  // 高度
  function updateHeight(): void {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }

  useEffect(() => {
    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [fontSize, speed, mirror, children]);

  // 滚动
  useEffect(() => {
    document.documentElement.scrollTo({
      top: positionToScroll(position)
    })
  }, dependencies);

  // 点击切换滚动状态
  function switchScrollingStatus() {
    if (!switchScrollingStatusWhenTap) {
      return;
    }

    if (scrolling) {
      controller.pause();
    } else {
      controller.start();
    }
  }

  // 同步用户滚动
  useEffect(() => {
    function syncUserScroll(ev: Event) {
      const newPosition = scrollToPosition(window.scrollY);

      // 识别是否为用户滚动，避免重复更新导致时间变慢
      if (Math.abs(newPosition - position) > 1) {
        // 认为是用户滚动，更新位置
        setPosition(newPosition);
      }

    }
    window.addEventListener('scroll', syncUserScroll);

    return () => {
      window.removeEventListener('scroll', syncUserScroll);
    }
  }, dependencies);

  const style: CSSProperties = {
    fontSize: `${fontSize}px`,
  };

  return <div
    ref={ref}
    style={style}
    className={`${styles.teleprompter}`}
    onClick={switchScrollingStatus}>
    <div className={`${styles.content} ${mirror ? styles.mirror : ''}`}>
      {children?.split('\n').map((v, n) => <p key={n}>{v}</p>)}
    </div>
    {showMask && <div className={styles.mask}>
      <div/>
      <div>
        {showProgress && <div className={styles.progress} style={{ width: `${progress * 100}%` }}/>}
      </div>
      <div/>
    </div>}
  </div>;
};

export default Teleprompter;
