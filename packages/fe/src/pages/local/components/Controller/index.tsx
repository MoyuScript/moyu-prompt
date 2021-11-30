import React, { useState } from 'react';
import styles from './index.less';
import { Slider, Switch } from 'antd';
import {
  FontSizeOutlined,
  FieldTimeOutlined,
  FontColorsOutlined,
  ReloadOutlined,
  Loading3QuartersOutlined
} from '@ant-design/icons';
import { configRange } from '@/const';
import Fullscreen from '@/components/Fullscreen';

export interface ControllerValues {
  fontSize: number
  speed: number
  mirror: boolean
  showProgress: boolean
}

export interface ControllerProps {
  initialValues: ControllerValues
  onChange?: (values: ControllerValues) => void
  reset?: () => void
}

const Controller: React.FC<ControllerProps> = ({ onChange, initialValues, reset }) => {
  const [config, setConfig] = useState(initialValues);

  function _onChange(values: Partial<ControllerValues>): void {
    const newConfig = {...config, ...values};
    setConfig(newConfig);
    if (onChange) {
      onChange(newConfig);
    }
  }

  return <div className={styles.controller}>
    <div className={styles.group}>
      <FontSizeOutlined/>
      <Slider
        min={configRange.fontSize[0]} max={configRange.fontSize[1]} style={{ width: '100px' }}
        defaultValue={config.fontSize}
        onChange={value => _onChange({fontSize: value})}
        tooltipVisible={false}/>
    </div>

    <div className={styles.group}>
      <FieldTimeOutlined/>
      <Slider
        min={configRange.speed[0]} max={configRange.speed[1]} style={{ width: '100px' }}
        defaultValue={config.speed}
        onChange={value => _onChange({speed: value})}
        tooltipVisible={false}/>
    </div>

    <div className={styles.group} >
      <FontColorsOutlined style={{ transform: 'scaleY(-1)' }}/>
      <Switch defaultChecked={config.mirror} onChange={value => _onChange({mirror: value})}/>
    </div>

    <div className={styles.group} >
      <Loading3QuartersOutlined/>
      <Switch defaultChecked={config.showProgress} onChange={value => _onChange({showProgress: value})}/>
    </div>

    <div className={styles.group}>
      <ReloadOutlined onClick={() => reset && reset()} style={{ cursor: 'pointer' }}/>
      <Fullscreen/>
    </div>
  </div>;
};

export default Controller;
