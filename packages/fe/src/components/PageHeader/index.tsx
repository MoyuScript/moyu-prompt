import { Layout } from 'antd';
import React from 'react';
import { Link } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.less';
export interface PageHeaderProps {
  center?: React.ReactNode,
  right?: React.ReactNode,
  returnTo?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ center, right, returnTo }) => {

  return <Layout.Header className={styles.header}>
    <div className={styles.left}>
      <Link to={returnTo || '/'}><ArrowLeftOutlined/></Link>
    </div>
    <div className={styles.center}>
      {center}
    </div>
    <div className={styles.right}>
      {right}
    </div>
  </Layout.Header>;
};

export default PageHeader;
