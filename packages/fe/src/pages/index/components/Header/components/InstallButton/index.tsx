import React, {useState, useEffect} from 'react';
import styles from './index.less';
import { Button, notification, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import * as storage from '@/utils/localStorage';
import { STORAGE_KEY } from '@/const';

export interface InstallButtonProps {

}

const InstallButton: React.FC<InstallButtonProps> = () => {
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    function onPrompt(ev: any) {
      ev.preventDefault();
      if (!storage.get(STORAGE_KEY.installPromptDisabled)) {
        notification.info({
          key: 'installPrompt',
          message: <div>
            <Typography.Title level={3}>安装此应用到你的设备</Typography.Title>
            <div>你可以安装此应用到你的设备上，以提供最佳的离线体验。点击下方的按钮进行安装。</div>
            <div>如果你暂时不想安装，也可以稍后点击主页上方的“安装”按钮安装应用。</div>
            <div style={{ marginTop: '2vw', textAlign: 'center' }}>
              <Button onClick={() => {
                ev.prompt();
                notification.close('installPrompt');
              }} style={{ width: '100%' }}>
                <PlusCircleOutlined/> 安装
              </Button>
            </div>
          </div>,
          duration: null,
          placement: 'bottomRight',
          onClose() {
            storage.set(STORAGE_KEY.installPromptDisabled, true);
          },

        })
      }
      setEvent(ev);
    }

    function onInstalled() {
      setEvent(null);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    }
  }, []);

  if (event) {
    return <Button onClick={() => event.prompt()}>
      <PlusCircleOutlined/> 安装
    </Button>;
  }

  return null;
};

export default InstallButton;
