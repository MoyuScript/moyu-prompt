import { createProject, editProject, getProjectList, Project } from '@/common/project';
import { Button, Empty, Modal, Typography, message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProjectEditor from './components/ProjectEditor';
import ProjectList, { ProjectListProps } from './components/ProjectList';
import styles from './index.less';
import moment from 'moment';
import { WarningOutlined } from '@ant-design/icons';

export interface ProjectManagerProps {
  onPickChange: (project: Project | null) => void
  onPick: (project: Project) => void
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ onPickChange, onPick }) => {
  const [projectList, setProjectList] = useState<Project[] | null>(null);

  useEffect(() => {
    getProjectList().then(projects => setProjectList(projects));
  }, []);

  const onAction: ProjectListProps['onAction'] = ({ name, project }) => {
    switch (name) {
      case 'open': {
        onPick(project);
        break;
      }
    }
  }

  type OpenEditorArgs = {
    isNew: true
  } | {
    isNew: false,
    project: Project
  };

  const openEditor = (args: OpenEditorArgs) => {
    let hasEdit = false;
    let values: Project = args.isNew ? {
      id: -1,
      content: '',
      ctime: Date.now(),
      name: `未命名工程 ${moment().format('YY-MM-DD HH:mm')}`
    } : args.project;

    const modal = Modal.confirm({
      title: <Typography.Title level={3}>{args.isNew ? '新建工程' : '编辑工程'}</Typography.Title>,
      okText: '保存',
      cancelText: '取消',
      icon: null,
      content: <ProjectEditor initialData={values} onChange={(project) => {
        hasEdit = true;
        values = project;
        modal.update({
          okButtonProps: {
            disabled: !(project.name && project.content)
          }
        });
      }}/>,
      async onOk() {
        if (args.isNew) {
          const p = await createProject({
            content: values.content,
            ctime: values.ctime,
            name: values.name
          });
          setProjectList([...projectList as Project[], p]);
          message.success(`成功创建工程：${p.name}`);
        } else {
          // 修改工程
          await editProject(values.id, {
            content: values.content,
            name: values.name
          });
          message.success(`成功修改工程：${values.name}`);
        }
      },
      onCancel(close) {
        if (hasEdit) {
          Modal.confirm({
            title: <Typography.Title level={3}>警告</Typography.Title>,
            content: <p>是否丢弃已作出的修改？</p>,
            onOk: () => close(),
            icon: <WarningOutlined />,
            cancelText: '取消',
            okText: '丢弃',
            okButtonProps: {
              danger: true
            }
          })
        } else {
          close();
        }
      },
      width: 1000
    })
  }

  return <div className={styles.projectManager}>
    {projectList !== null && (
      projectList.length > 0 ? <ProjectList projects={projectList} onAction={onAction} onPickChange={onPickChange}/>
      : (
        <Empty description='啥也木有，快来新建工程吧'>
          <Button type='primary' size='large' onClick={() => openEditor({isNew: true})}>新建工程</Button>
        </Empty>
      )
    )}
  </div>;
};

export default ProjectManager;
