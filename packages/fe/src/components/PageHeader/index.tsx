import { Layout } from 'antd';
import React from 'react';
import { Link, history } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.less';
export interface PageHeaderProps {
  center?: React.ReactNode,
  right?: React.ReactNode,
}

const PageHeader: React.FC<PageHeaderProps> = ({ center, right }) => {

  return <Layout.Header className={styles.header}>
    <div className={styles.left}>
      <a onClick={() => history.goBack()}><ArrowLeftOutlined/></a>
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
