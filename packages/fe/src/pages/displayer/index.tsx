import PageHeader from '@/components/PageHeader';
import { Layout } from 'antd';
import React from 'react';
import { Link } from 'umi';
import { ArrowLeftOutlined, WifiOutlined } from '@ant-design/icons';
import styles from './index.less';
import Code from './components/Code';
import ConnectionStatus from '../../components/ConnectionStatus';

export interface DisplayerPageProps {

}

const DisplayerPage: React.FC<DisplayerPageProps> = () => {

  const headerCenter = <>
    <Code code='233333' />
  </>;

  const headerRight = <>
    <ConnectionStatus/>
  </>;

  return <>
    <Layout>
      <PageHeader center={headerCenter} right={headerRight}/>
    </Layout>
  </>;
};

export default DisplayerPage;
