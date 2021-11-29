import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Layout } from 'antd';

export interface LocalPageProps {

}

const LocalPage: React.FC<LocalPageProps> = () => {

  return <>
    <Layout>
      <PageHeader returnTo={'/'}/>
    </Layout>
  </>;
};

export default LocalPage;
