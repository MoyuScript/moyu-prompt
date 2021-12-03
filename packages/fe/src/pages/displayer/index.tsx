import PageHeader from '@/components/PageHeader';
import { Layout, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { ArrowLeftOutlined, WifiOutlined } from '@ant-design/icons';
import styles from './index.less';
import Code from './components/Code';
import ConnectionStatus from '../../components/ConnectionStatus';
import PageContent from '@/components/PageContent';
import Teleprompter, {
  TeleprompterController,
} from '@/components/Teleprompter';
import { configUseState } from '@/common/useStateInitialFunctions';
import createSocket from '@/common/socket';
import * as storage from '@/utils/localStorage';
import { STORAGE_KEY } from '@/const';
import { debounce } from 'lodash';
import { Socket } from 'socket.io-client';

export interface DisplayerPageProps {}

const DisplayerPage: React.FC<DisplayerPageProps> = () => {
  const [code, setCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState('');
  const [config, setConfig] = useState(configUseState);
  const [controller, setController] = useState<TeleprompterController | null>(
    null,
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  const setConfigDebounce = debounce(setConfig, 50);

  function connect() {
    const sock = createSocket();
    setSocket(sock);

    if (!sock.connected) {
      sock.connect();
      sock.on('connect', () => {
        sock.emit('authentication', { character: 'displayer' }, (res: any) => {
          if (res.ok) {
            setCode(res.data.code);
          } else {
            message.error(`连接失败：${res.msg}`);
          }
        });

        sock.on('disconnect', () => {
          setConnected(false);
          setCode('');
        });

        sock.on('join', () => {
          setConnected(true);
          message.success('遥控器已连接');
          console.log(config);
          // 同步本地设置给遥控器
          sock.emit('syncConfig', config);
        });

        sock.on('leave', () => {
          message.warning('遥控器已断开');
          setConnected(false);
        });

        sock.on('updateConfig', (config) => {
          setConfigDebounce((c) => {
            const newConfig = { ...c, ...config };
            storage.set(STORAGE_KEY.config, newConfig);
            return newConfig;
          });
        });

        sock.on('switchScrollingStatus', () => {
          if (controller) {
            controller.switch();
          }
        });

        sock.on('updateContent', (content) => {
          setContent(content);
        });

        sock.on('scroll', (deltaY) => {
          if (controller) {
            controller.scrollBy(config.mirror ? deltaY : -deltaY);
          }
        });
      });
    }
  }

  useEffect(() => {
    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (controller) {
      connect();
    }
  }, [controller]);

  const headerCenter = (
    <>
      <Code code={code} />
    </>
  );

  const headerRight = (
    <>
      <ConnectionStatus connected={connected} />
    </>
  );

  return (
    <>
      <Layout>
        <PageHeader center={headerCenter} right={headerRight} autoHide />
        <PageContent>
          <Teleprompter
            onControllerAvailable={(c) => setController(c)}
            {...config}
            children={content}
            userInputControllable={false}
          />
        </PageContent>
      </Layout>
    </>
  );
};

export default DisplayerPage;
