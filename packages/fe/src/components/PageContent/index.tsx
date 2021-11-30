import React from 'react';
import styles from './index.less'

export interface PageContentProps {

}

const PageContent: React.FC<PageContentProps> = ({ children }) => {

  return <div className={styles.content}>
    {children}
  </div>;
};

export default PageContent;
