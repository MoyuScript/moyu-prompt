import { Layout } from 'antd';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import ConnectionStatus from '@/components/ConnectionStatus';

export interface ControllerPageProps {

}

const ControllerPage: React.FC<ControllerPageProps> = () => {

  const headerRight = <>
    <ConnectionStatus />
  </>;

  return <>
    <Layout>
      <PageHeader right={headerRight}/>
    </Layout>
  </>;
};

export default ControllerPage;
