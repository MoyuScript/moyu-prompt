import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

export interface FullscreenProps {
  showText?: boolean;
}

const Fullscreen: React.FC<FullscreenProps> = ({ showText }) => {
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    function onChange() {
      setFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener('fullscreenchange', onChange);

    return () => {
      document.removeEventListener('fullscreenchange', onChange);
    };
  }, []);

  async function on() {
    try {
      await document.documentElement.requestFullscreen({
        navigationUI: 'hide',
      });
      setFullscreen(true);
    } catch (e) {}
  }

  async function off() {
    try {
      await document.exitFullscreen();
      setFullscreen(false);
    } catch (e) {}
  }

  return fullscreen ? (
    <span onClick={off} className={styles.fullscreen}>
      <FullscreenExitOutlined /> {showText && '切换全屏'}
    </span>
  ) : (
    <span onClick={on} className={styles.fullscreen}>
      <FullscreenOutlined /> {showText && '切换全屏'}
    </span>
  );
};

export default Fullscreen;
