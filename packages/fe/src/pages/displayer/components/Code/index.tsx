import React from 'react';
import styles from './index.less';

import { LoadingOutlined } from '@ant-design/icons';

export interface CodeProps {
  code?: string
}

const Code: React.FC<CodeProps> = ({ code }) => {
  return <span className={styles.code}>
    <span>{code ? `连接码：${code}` : <>正在获取连接码 <LoadingOutlined spin/></>}</span>
  </span>;
};

export default Code;
