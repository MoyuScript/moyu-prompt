import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { Layout, message } from 'antd';
import Teleprompter, { TeleprompterController } from '@/components/Teleprompter';
import PageContent from '@/components/PageContent';
import Controller, { ControllerValues } from './components/Controller';
import { debounce } from 'lodash';
import { formatDuration } from '@/utils';
import * as storage from '@/utils/localStorage';
import { STORAGE_KEY } from '@/const';
import { configUseState } from '@/common/useStateInitialFunctions';
import { useLocation } from 'umi';
import { getProject, Project } from '@/common/project';

export interface LocalPageProps {

}

const LocalPage: React.FC<LocalPageProps> = () => {
  const [config, setConfig] = useState(configUseState);
  useEffect(() => {
    storage.set(STORAGE_KEY.config, config);
  }, [config])

  const [estimateDuration, setEstimateDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [controller, setController] = useState<TeleprompterController | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const onControllerValueChange = debounce((config: ControllerValues) => setConfig(config), 50);

  const remainingTime = estimateDuration - estimateDuration * progress;

  const location = useLocation();
  const search = new URLSearchParams(location.search);

  useEffect(() => {
    const id = Number(search.get('id'));

    if (Number.isNaN(id)) {
      message.error('获取工程 ID 错误');
      return;
    }

    getProject(id).then((project) => {
      if (!project) {
        message.error('工程不存在');
        return;
      }

      setProject(project);
      document.title = `${project.name} - 摸鱼提词器`;
    })
  }, [location.search]);

  return <>
    <Layout>
      <PageHeader
        center={<Controller reset={controller ? controller.reset : undefined} initialValues={config} onChange={onControllerValueChange}/>}
        right={<span>-{formatDuration(remainingTime)}</span>}
      />
      <PageContent>
        <Teleprompter
          onEstimatedDurationUpdate={estimateDuration => setEstimateDuration(estimateDuration)}
          onProgress={progress => setProgress(progress)}
          onControllerAvailable={controller => setController(controller)}
          {...config}>
        {project ? project.content : ''}
        </Teleprompter>
      </PageContent>
    </Layout>
  </>;
};

export default LocalPage;
