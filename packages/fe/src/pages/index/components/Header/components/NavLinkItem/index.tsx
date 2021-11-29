import React, { ReactNode } from 'react';
import styles from './index.less';

export interface NavLinkItemProps {
  icon?: ReactNode
  href: string
  children?: string
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({children, href, icon}) => {

  return <a href={href} target='_blank' className={styles.item}>
    <span className={styles.icon}>
      {icon}
    </span>
    <span className={styles.text}>
      {children}
    </span>
  </a>;
};

export default NavLinkItem;
