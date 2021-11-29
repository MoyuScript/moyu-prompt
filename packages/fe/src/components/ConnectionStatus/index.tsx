import React from 'react';
import { WifiOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface ConnectionStatusProps {
  connected?: boolean
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ connected }) => {

  return <span className={styles.connectionStatus}>
    <WifiOutlined className={connected ? styles.connected : styles.disconnected}/>
    {!connected && <CloseOutlined className={styles.close}/>}
  </span>;
};

export default ConnectionStatus;
