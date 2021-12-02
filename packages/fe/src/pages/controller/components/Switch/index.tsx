import React, { useState } from 'react';
import styles from './index.less';

export interface SwitchProps {
  initialValue?: boolean
  onChange?: (value: boolean) => void
  icon?: React.ReactNode
}

const Switch: React.FC<SwitchProps> = ({ initialValue = false, icon, onChange }) => {
  const [value, setValue] = useState(initialValue);

  return <div className={styles.switch}>
    <div className={`${styles.inner} ${value ? styles.on : ''}`} onClick={() => {
      setValue(v => !v)
      if (onChange) {
        onChange(!value);
      }
    }}>
      <div className={styles.icon}>{icon}</div>
    </div>
  </div>;
};

export default Switch;
