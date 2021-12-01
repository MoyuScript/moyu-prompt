import styles from './index.less';
import { history, Link } from 'umi';
import { Anchor, Button, Layout } from 'antd';
import Header from './components/Header';
import { chooseProject } from '@/common/project';

export default function IndexPage() {

  function navTo(path: string): void {
    history.push(path);
  }

  return (
    <Layout>
      <Header />
      <Layout className={styles.content}>
        <h1 className={styles.title}>摸鱼提词器</h1>
        <div className={styles.btnGroup}>
          <Button className={styles.btn} onClick={() => navTo('/controller')}>遥控器</Button>
          <Button className={styles.btn} onClick={() => navTo('/displayer')}>显示器</Button>
          <Button className={styles.btn} onClick={async () => {
            const project = await chooseProject();

            if (project) {
              navTo(`/local?id=${project.id}`);
            }
          }}>仅本地</Button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4em' }}>
          <Link to='/help'>查看帮助</Link>
        </div>
      </Layout>
    </Layout>
  );
}
