import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

export interface FullscreenProps {

}

const Fullscreen: React.FC<FullscreenProps> = () => {
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
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } catch (e) {}
  }

  async function off() {
    try {
      await document.exitFullscreen();
      setFullscreen(false);
    } catch (e) {}
  }

  return fullscreen ? <FullscreenExitOutlined className={styles.fullscreen} onClick={off}/>
    : <FullscreenOutlined className={styles.fullscreen} onClick={on}/>;
};

export default Fullscreen;
