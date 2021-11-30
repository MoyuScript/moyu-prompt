import { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';
import React, { useState, useRef, useEffect } from 'react';

import styles from './index.less';

export interface TeleprompterController {
  scrollBy: (deltaY: number) => void
  start: () => void
  pause: () => void
  reset: () => void
}

export interface TeleprompterProps {
  children?: string
  fontSize?: number
  speed?: number
  mirror?: boolean
  onControllerAvailable?: (controller: TeleprompterController) => void
  onProgress?: (progress: number) => void
  onEstimatedDurationUpdate?: (timeRemaining: number) => void
}

const Teleprompter: React.FC<TeleprompterProps> = ({
  children,
  fontSize = 64,
  speed = 1,
  mirror = false,
  onControllerAvailable,
  onEstimatedDurationUpdate,
  onProgress,
}) => {
  const [position, setPosition] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [height, setHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const interval = speed * 100;

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
      this.pause();
      setPosition(0);
    }
  };

  useEffect(() => {
    if (onControllerAvailable) {
      onControllerAvailable(controller);
    }
  }, []);

  // 滚动控制
  useEffect(() => {
    if (scrolling) {
      const intervalId = setInterval(() => {
        setPosition(prev => prev + 1);
      }, interval);
      setIntervalId(intervalId);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [scrolling]);

  // 预计时长计算
  function calculateEstimatedDuration(): number {
    return height * interval;
  }

  useEffect(() => {
    if (onEstimatedDurationUpdate) {
      onEstimatedDurationUpdate(calculateEstimatedDuration());
    }
  }, [fontSize, speed, height]);

  // 进度
  useEffect(() => {
    if (onProgress && ref.current) {
      onProgress(position / ref.current.clientHeight);
    }
  }, [position]);

  // 高度
  function updateHeight(): void {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }

  useEffect(() => {
    // 下一事件循环计算
    setTimeout(() => {
      updateHeight();
    }, 0);

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // 滚动
  useEffect(() => {
    document.documentElement.scrollTo({
      top: position
    })
  }, [position]);

  const style: CSSProperties = {
    fontSize: `${fontSize}px`,
    transform: `scale`
  };

  return <div ref={ref} style={style} className={`${styles.teleprompter} ${mirror ? styles.mirror : ''}`}>
    {children?.split('\n').map((v, n) => <p key={n}>{v}</p>)}
  </div>;
};

export default Teleprompter;
