import { Layout } from 'antd';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import ConnectionStatus from '@/components/ConnectionStatus';
import PageContent from '@/components/PageContent';
import { useState } from 'react';
import { configUseState } from '@/common/useStateInitialFunctions';
import styles from './index.less';
import { FontSizeOutlined, FieldTimeOutlined, Loading3QuartersOutlined, FontColorsOutlined } from '@ant-design/icons';
import Slider from './components/Slider';
import Switch from './components/Switch';

export interface ControllerPageProps {

}

const ControllerPage: React.FC<ControllerPageProps> = () => {
  const [config, setConfig] = useState(configUseState);

  const headerRight = <>
    <ConnectionStatus />
  </>;

  return <>
    <Layout className={styles.controller}>
      <PageHeader right={headerRight}/>
      <PageContent className={styles.content}>
        <div className={styles.slider}>
          <Slider icon={<FontSizeOutlined/>}/>
        </div>
        <div className={styles.slider}>
          <Slider icon={<FieldTimeOutlined/>}/>
        </div>
        <div className={styles.switch}>
          <Switch icon={<Loading3QuartersOutlined/>}/>
        </div>
        <div className={styles.switch}>
          <Switch icon={<FontColorsOutlined style={{ transform: 'scaleY(-1)' }}/>}/>
        </div>
        <div className={styles.touchPad}></div>
      </PageContent>
    </Layout>
  </>;
};

export default ControllerPage;
