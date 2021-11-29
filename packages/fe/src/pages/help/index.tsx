import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Layout } from 'antd';

export interface HelpPageProps {

}

const HelpPage: React.FC<HelpPageProps> = () => {

  return <>
    <Layout>
      <PageHeader returnTo={'/'} center={'帮助'}/>
    </Layout>
  </>;
};

export default HelpPage;
