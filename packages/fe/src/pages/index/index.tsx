import styles from './index.less';
import { history, Link, useLocation } from 'umi';
import { Anchor, Button, Layout, message } from 'antd';
import Header from './components/Header';
import { Project } from '@/common/project';
import ProjectManager from '@/components/ProjectManager';
import React, { useState } from 'react';
import Fullscreen from '@/components/Fullscreen';

export default function IndexPage() {
  const [projectManagerVisible, setProjectManagerVisible] = useState(false);
  const [onPickGoto, setOnPickGoto] = useState('');

  const location = useLocation();

  function navTo(path: string): void {
    history.push(path);
  }

  function onPick(project: Project | null) {
    if (project) {
      const search = new URLSearchParams(location.search);
      search.set('id', project.id.toString());
      navTo(`${onPickGoto}?${search.toString()}`);
    }

    setProjectManagerVisible(false);
  }

  return (
    <Layout className={styles.index}>
      <Header />
      <Layout className={styles.content}>
        <h1 className={styles.title}>摸鱼提词器</h1>
        <div className={styles.tip}>（请横屏使用 {<span style={{color: '#00e0ff'}}><Fullscreen showText/></span>}）</div>
        <div className={styles.btnGroup}>
          <Button
            className={styles.btn}
            onClick={() => {
              if (!navigator.onLine) {
                message.error('请检查你的网络连接！')
                return;
              }
              setProjectManagerVisible(true);
              setOnPickGoto('/controller');
            }}
          >
            遥控器
          </Button>
          <Button className={styles.btn} onClick={() => {
            if (!navigator.onLine) {
              message.error('请检查你的网络连接！')
              return;
            }
            navTo('/displayer')
          }}>
            显示器
          </Button>
          <Button
            className={styles.btn}
            onClick={() => {
              setProjectManagerVisible(true);
              setOnPickGoto('/local');
            }}
          >
            仅本地
          </Button>
        </div>
        <div className={styles.help}>
          <Link to="/help">查看帮助</Link>
        </div>
        <ProjectManager visible={projectManagerVisible} onPick={onPick} />
      </Layout>
    </Layout>
  );
}
