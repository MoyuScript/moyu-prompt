import { Layout, Button, message } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import ConnectionStatus from '@/components/ConnectionStatus';
import PageContent from '@/components/PageContent';
import { configUseState } from '@/common/useStateInitialFunctions';
import styles from './index.less';
import {
  FontSizeOutlined,
  FieldTimeOutlined,
  Loading3QuartersOutlined,
  FontColorsOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Slider from './components/Slider';
import Switch from './components/Switch';
import TouchPad from './components/TouchPad';
import { CONFIG_RANGE, DEFAULT_CONFIG } from '@/const';
import { TeleprompterConfig } from '@/components/Teleprompter';
import createSocket from '@/common/socket';
import { getProject, Project } from '@/common/project';
import { history, useLocation } from 'umi';
import { Socket } from 'socket.io-client';
import Fullscreen from '@/components/Fullscreen';

message.config({
  top: 100,
});

export interface ControllerPageProps {}

const ControllerPage: React.FC<ControllerPageProps> = () => {
  // 控制器使用显示器设备的设置
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });
  const [code, setCode] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // 0 未连接，1 连接中，2 已连接，3 异常断开
  const [connectionStage, setConnectionStage] = useState(0);

  const location = useLocation();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const id = Number(search.get('id'));

    if (Number.isNaN(id)) {
      message.error('无法获取工程信息');
      history.push('/');
      return;
    }

    getProject(id).then((project) => {
      if (project === null) {
        message.error('无法获取工程信息');
        history.push('/');
        return;
      }
      console.log('Set', project)
      setProject(project);
    });
  }, []);

  useEffect(() => {
    console.log(socket, project, connectionStage)
    if (socket && connectionStage === 2) {
      if (project) {
        socket.emit('updateContent', project.content);
      }
    }
  }, [connectionStage, project, socket]);

  useEffect(() => {
    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  function connect(code: string) {
    const sock = createSocket();
    setSocket(sock);
    setConnectionStage(1);

    sock.connect();
    sock.on('connect', () => {
      sock.emit(
        'authentication',
        { code, character: 'controller' },
        (res: any) => {
          if (!res.ok) {
            message.error(`连接失败：${res.msg}`);
            setConnectionStage(0);
            setCode('');
            sock.disconnect();
            return;
          }

          message.success('连接成功');
          setConnectionStage(2);
        },
      );
    });

    sock.on('disconnect', (reason) => {
      if (reason === 'io client disconnect') {
        message.success('已断开连接');
        setConnectionStage(0);
        return;
      }

      message.error('服务器断开连接，准备重连');
      setTimeout(() => {
        setConnectionStage(1);
        sock.connect();
      }, 1000);
      setConnectionStage(3);
    });

    sock.on('syncConfig', (config) => {
      setConfig(config);
    });

    sock.on('leave', () => {
      message.error('显示器已退出');
      setConnectionStage(0);
      setCode('');
    });
  }

  const headerRight = (
    <div>
      <Fullscreen/>
      <ConnectionStatus connected={connectionStage === 2} />
    </div>
  );

  let headerCenter: React.ReactNode;

  if (connectionStage === 0) {
    headerCenter = (
      <div>
        输入连接码：
        <input
          maxLength={8}
          value={code}
          onChange={(ev) => {
            const v = ev.target.value;

            if (/^\d*$/.test(v)) {
              setCode(ev.target.value);
            }

            if (v.length === 8) {
              connect(v);
            }
          }}
          className={styles.codeInput}
        />
      </div>
    );
  } else if (connectionStage === 1) {
    headerCenter = (
      <div>
        <LoadingOutlined /> 连接 {code} 中
      </div>
    );
  } else if (connectionStage === 2) {
    headerCenter = (
      <div>
        已连接 {code}&nbsp;
        <Button
          size="small"
          danger
          onClick={() => {
            socket!.disconnect();
            setCode('');
            setConnectionStage(0);
          }}
        >
          断开
        </Button>
      </div>
    );
  } else if (connectionStage === 3) {
    headerCenter = (
      <div>
        <span style={{ color: 'red' }}>异常断开连接，正在重连...</span>{' '}
        <Button>取消</Button>
      </div>
    );
  }

  function percentToValue(min: number, max: number, percent: number): number {
    return (max - min) * percent + min;
  }

  function valueToPercent(min: number, max: number, value: number): number {
    return (value - min) / (max - min);
  }

  const [minFontSize, maxFontSize] = CONFIG_RANGE.fontSize;
  const [minSpeed, maxSpeed] = CONFIG_RANGE.speed;

  const updateRemoteConfig = useCallback(
    (config: Partial<TeleprompterConfig>) => {
      if (socket && socket.connected) {
        socket.emit('updateConfig', config);
      }
    },
    [socket],
  );

  function changeRemotePosition(deltaY: number) {
    if (deltaY === 0) {
      return;
    }
    if (socket && socket.connected) {
      socket.emit('scroll', deltaY);
    }
  }

  function switchRemoteScrollingStatus() {
    if (socket && socket.connected) {
      socket!.emit('switchScrollingStatus', null);
    }
  }

  return (
    <>
      <Layout className={styles.controller}>
        <PageHeader right={headerRight} center={headerCenter} />
        <PageContent className={styles.content}>
          <div className={styles.slider}>
            <Slider
              value={valueToPercent(minFontSize, maxFontSize, config.fontSize)}
              icon={<FontSizeOutlined />}
              onChange={(percent) => {
                const fontSize = percentToValue(
                  minFontSize,
                  maxFontSize,
                  percent,
                );
                setConfig((c) => ({ ...c, fontSize }));
                updateRemoteConfig({ fontSize });
              }}
            />
          </div>
          <div className={styles.slider}>
            <Slider
              value={valueToPercent(minSpeed, maxSpeed, config.speed)}
              icon={<FieldTimeOutlined />}
              onChange={(percent) => {
                const speed = percentToValue(minSpeed, maxSpeed, percent);
                setConfig((c) => ({ ...c, speed }));
                updateRemoteConfig({ speed });
              }}
            />
          </div>
          <div className={styles.switch}>
            <Switch
              value={config.showProgress}
              icon={<Loading3QuartersOutlined />}
              onChange={(showProgress) => {
                setConfig((config) => ({ ...config, showProgress }));
                updateRemoteConfig({ showProgress });
              }}
            />
          </div>
          <div className={styles.switch}>
            <Switch
              value={config.mirror}
              icon={<FontColorsOutlined style={{ transform: 'scaleY(-1)' }} />}
              onChange={(mirror) => {
                setConfig((config) => ({ ...config, mirror }));
                updateRemoteConfig({ mirror });
              }}
            />
          </div>
          <div className={styles.touchPad}>
            <TouchPad
              onScroll={(y) => changeRemotePosition(y)}
              onTap={() => switchRemoteScrollingStatus()}
            />
          </div>
        </PageContent>
      </Layout>
    </>
  );
};

export default ControllerPage;
