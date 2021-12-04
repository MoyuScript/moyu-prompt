import GithubFilled from '@ant-design/icons/lib/icons/GithubFilled';
import { Layout } from 'antd';
import React from 'react';
import { Link } from 'umi';
import InstallButton from './components/InstallButton';
import NavLink from './components/NavLink';
import NavLinkItem from './components/NavLinkItem';

import styles from './index.less';

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Layout.Header className={styles.header}>
      <Link to="/" style={{ color: 'inherit', height: '100%' }}>
        <img src='assets/logo@500x500.png' style={{height: '100%', display: 'block'}} />
      </Link>
      <div>
        <InstallButton/>
      </div>
      <NavLink>
        <NavLinkItem href="https://space.bilibili.com/660303135">
          哔哩哔哩
        </NavLinkItem>
        <NavLinkItem
          icon={<GithubFilled />}
          href="https://github.com/MoyuScript/moyu-prompt"
        >
          GitHub
        </NavLinkItem>
      </NavLink>
    </Layout.Header>
  );
};

export default Header;
