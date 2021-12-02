import {
  createProject,
  deleteProject,
  editProject,
  getProjectList,
  Project,
} from '@/common/project';
import { Button, Empty, Modal, Typography, message } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import ProjectEditor from './components/ProjectEditor';
import ProjectList, { ProjectListProps } from './components/ProjectList';
import styles from './index.less';
import moment from 'moment';
import { WarningOutlined } from '@ant-design/icons';

export interface ProjectManagerProps {
  visible: boolean;
  onPick: (project: Project | null) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ visible, onPick }) => {
  const [projectList, setProjectList] = useState<Project[] | null>(null);
  const [pickedProject, setPickedProject] = useState<Project | null>(null);

  const projectListDisplay = useMemo(() => {
    if (!projectList) {
      return null;
    }

    return projectList.sort((a, b) => b.id - a.id);
  }, [projectList]);

  async function updateProjectList() {
    setProjectList(await getProjectList());
  }

  useEffect(() => {
    updateProjectList();
  }, []);

  const onAction: ProjectListProps['onAction'] = ({ name, project }) => {
    switch (name) {
      case 'open': {
        onPick(project);
        break;
      }
    }
  };

  type OpenEditorArgs =
    | {
        isNew: true;
      }
    | {
        isNew: false;
        project: Project;
      };

  const openEditor = (args: OpenEditorArgs) => {
    let hasEdit = false;
    let values: Project = args.isNew
      ? {
          id: -1,
          content: '',
          name: `未命名工程 ${moment().format('YY-MM-DD HH:mm')}`,
        }
      : args.project;

    const modal = Modal.confirm({
      title: (
        <Typography.Title level={3}>
          {args.isNew ? '新建工程' : '编辑工程'}
        </Typography.Title>
      ),
      okText: '保存',
      cancelText: '取消',
      icon: null,
      content: (
        <ProjectEditor
          initialData={values}
          onChange={(project) => {
            hasEdit = true;
            values = project;
            modal.update({
              okButtonProps: {
                disabled: !(project.name && project.content),
              },
            });
          }}
        />
      ),
      async onOk() {
        if (args.isNew) {
          const p = await createProject({
            content: values.content,
            name: values.name,
          });
          message.success(`成功创建工程：${p.name}`);
          updateProjectList();
        } else {
          // 修改工程
          await editProject(values.id, {
            content: values.content,
            name: values.name,
          });
          message.success(`成功修改工程：${values.name}`);
          updateProjectList();
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
              danger: true,
            },
            maskClosable: true,
          });
        } else {
          close();
        }
      },
      width: '90vw',
      centered: true
    });
  };

  return (
    <Modal
      {...{
        className: styles.projectManager,
        visible,
        title: <Typography.Title level={3}>请选择你的工程</Typography.Title>,
        footer: (
          <div className={styles.modalFooter}>
            <div className={styles.left}>
              <Button
                onClick={() => openEditor({ isNew: true })}
                type="primary"
              >
                新建
              </Button>
              <Button
                disabled={!pickedProject}
                onClick={() =>
                  openEditor({
                    isNew: false,
                    project: pickedProject as Project,
                  })
                }
              >
                编辑
              </Button>
              <Button
                danger
                disabled={!pickedProject}
                onClick={() =>
                  Modal.confirm({
                    title: <Typography.Title level={3}>警告</Typography.Title>,
                    content: <p>是否删除该工程？删除后将永久丢失！！</p>,
                    onOk: async () => {
                      await deleteProject(pickedProject!.id);
                      message.success(`成功删除工程 ${pickedProject!.name}`);
                      setPickedProject(null);
                      updateProjectList();
                    },
                    icon: <WarningOutlined />,
                    cancelText: '取消',
                    okText: '删除',
                    okButtonProps: {
                      danger: true,
                    },
                    maskClosable: true,
                  })
                }
              >
                删除
              </Button>
            </div>
            <div className={styles.right}>
              <Button
                type="primary"
                disabled={!pickedProject}
                onClick={() => onPick(pickedProject)}
              >
                打开
              </Button>
              <Button onClick={() => onPick(null)}>取消</Button>
            </div>
          </div>
        ),
        onCancel: () => onPick(null),
        width: '90vw',
        centered: true
      }}
    >
      <div className={styles.content}>
        {projectListDisplay !== null &&
          (projectListDisplay.length > 0 ? (
            <ProjectList
              pickedProject={pickedProject}
              projects={projectListDisplay}
              onAction={onAction}
              onPickChange={(p) => setPickedProject(p)}
            />
          ) : (
            <Empty description="啥也木有，快来新建工程吧">
              <Button
                type="primary"
                size="large"
                onClick={() => openEditor({ isNew: true })}
              >
                新建工程
              </Button>
            </Empty>
          ))}
      </div>
    </Modal>
  );
};

export default ProjectManager;
