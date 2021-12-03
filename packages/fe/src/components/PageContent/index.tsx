import React from 'react';
import styles from './index.less';

export interface PageContentProps {
  [key: string]: unknown;
}

const PageContent: React.FC<PageContentProps> = ({ children, ...others }) => {
  return (
    <div
      className={`${styles.content}${
        others.className ? ' ' + others.className : ''
      }`}
      {...others}
    >
      {children}
    </div>
  );
};

export default PageContent;
