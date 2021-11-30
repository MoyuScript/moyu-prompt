import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, history } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.less';
export interface PageHeaderProps {
  center?: React.ReactNode,
  right?: React.ReactNode,
  autoHide?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({ center, right, autoHide = false }) => {
  const [hide, setHide] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // 自动隐藏
  useEffect(() => {
    function resetTimer() {
      setTimerId(timerId => {
        if (timerId) {
          clearTimeout(timerId);
        }

        return setTimeout(() => {
          setHide(true);
          setTimerId(null);
        }, 10000);
      });
    }

    function onMouseMove() {
      setHide(() => false);
      resetTimer();
    }

    if (autoHide) {
      window.addEventListener('mousemove', onMouseMove);
      resetTimer();
    }

    return () => {
      if (autoHide) {
        if (timerId) {
          clearTimeout(timerId);
        }
        window.removeEventListener('mousemove', onMouseMove);
      }
    }
  }, [autoHide])

  return <Layout.Header className={`${styles.header} ${hide ? styles.hide : ''}`}>
    <div className={styles.area}>
      <a onClick={() => history.goBack()}><ArrowLeftOutlined/></a>
    </div>
    <div className={styles.area}>
      {center}
    </div>
    <div className={styles.area}>
      {right}
    </div>
  </Layout.Header>;
};

export default PageHeader;
