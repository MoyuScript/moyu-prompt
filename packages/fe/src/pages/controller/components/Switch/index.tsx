import React, { useState } from 'react';
import styles from './index.less';

export interface SwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  icon?: React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({ value = false, icon, onChange }) => {
  return (
    <div className={styles.switch}>
      <div
        className={`${styles.inner} ${value ? styles.on : ''}`}
        onClick={() => {
          navigator.vibrate([50]);
          if (onChange) {
            onChange(!value);
          }
        }}
      >
        <div className={styles.icon}>{icon}</div>
      </div>
    </div>
  );
};

export default Switch;
