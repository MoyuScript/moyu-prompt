import React from 'react';
import styles from './index.less';

export interface NavLinkProps {}

const NavLink: React.FC<NavLinkProps> = ({ children }) => {
  return <div className={styles.nav}>{children}</div>;
};

export default NavLink;
