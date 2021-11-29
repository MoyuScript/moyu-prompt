import GithubFilled from '@ant-design/icons/lib/icons/GithubFilled';
import { Layout } from 'antd';
import React from 'react';
import { Link } from 'umi';
import NavLink from './components/NavLink';
import NavLinkItem from './components/NavLinkItem';

import styles from './index.less';

export interface HeaderProps {

}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Layout.Header className={styles.content}>
      <h1><Link to='/' style={{ color: 'inherit' }}>摸鱼提词器</Link></h1>
      <NavLink>
        <NavLinkItem icon={<GithubFilled/>} href='https://github.com/MoyuScript/moyu-prompt'>GitHub</NavLinkItem>
      </NavLink>
    </Layout.Header>
  );
};

export default Header;
