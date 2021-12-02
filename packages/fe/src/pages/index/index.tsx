import styles from './index.less';
import { history, Link } from 'umi';
import { Anchor, Button, Layout } from 'antd';
import Header from './components/Header';
import { Project } from '@/common/project';
import ProjectManager from '@/components/ProjectManager';
import React, { useState } from 'react';

export default function IndexPage() {
  const [projectManagerVisible, setProjectManagerVisible] = useState(false);

  function navTo(path: string): void {
    history.push(path);
  }

  function onPick(project: Project | null) {
    if (project) {
      navTo(`/local?id=${project.id}`)
    }

    setProjectManagerVisible(false);
  }

  return (
    <Layout className={styles.index}>
      <Header />
      <Layout className={styles.content}>
        <h1 className={styles.title}>摸鱼提词器</h1>
        <div className={styles.tip}>（请横屏使用）</div>
        <div className={styles.btnGroup}>
          <Button className={styles.btn} onClick={() => navTo('/controller')}>遥控器</Button>
          <Button className={styles.btn} onClick={() => navTo('/displayer')}>显示器</Button>
          <Button className={styles.btn} onClick={() => setProjectManagerVisible(true)}>仅本地</Button>
        </div>
        <div className={styles.help}>
          <Link to='/help'>查看帮助</Link>
        </div>
        <ProjectManager visible={projectManagerVisible} onPick={onPick}/>
      </Layout>
    </Layout>
  );
}
