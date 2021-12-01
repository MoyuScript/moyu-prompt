import ProjectManager, { ProjectManagerProps } from "@/components/ProjectManager";
import { Modal, Typography } from 'antd';
import { openDB } from 'idb';
import { merge } from 'lodash';

const DATABASE_CONFIG = {
  name: 'projects',
  version: 1,
};

export interface Project {
  id: number
  name: string
  content: string
  ctime: number
}

export async function chooseProject(): Promise<Project | null> {
  return new Promise(resolve => {
    let projectPicked: Project | null = null;

    const modal = Modal.confirm({
      icon: null,
      okText: '打开',
      cancelText: '取消',
      okButtonProps: {
        disabled: true
      },
      title: <Typography.Title level={3}>请选择你的工程</Typography.Title>,
      content: <ProjectManager onPickChange={pick => {
        projectPicked = pick;

        modal.update({
          okButtonProps: {
            disabled: pick === null
          },
        })
      }}
      onPick={pick => {
        resolve(pick);
        modal.destroy();
      }}/>,
      width: 1024,
      maskClosable: true,
      centered: true,
      onCancel: () => resolve(null),
      onOk: () => resolve(projectPicked)
    });
  })

}

async function openDatabase() {
  const db = await openDB(DATABASE_CONFIG.name, DATABASE_CONFIG.version, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore(DATABASE_CONFIG.name, {autoIncrement: true, keyPath: 'id'});
      }
    }
  });

  return db;
}

export async function deleteProject(id: Project['id']): Promise<void> {
  const db = await openDatabase();

  return await db.delete(DATABASE_CONFIG.name, id);
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const db = await openDatabase();

  const id = await db.add(DATABASE_CONFIG.name, project);
  return {
    id: Number(id),
    ...project
  }
}

export async function editProject(id: Project['id'], project: Omit<Partial<Project>, 'id'>): Promise<void> {
  const db = await openDatabase();

  const oldData = await db.get(DATABASE_CONFIG.name, id);

  if (!oldData) {
    throw new Error('工程不存在');
  }

  const newData = merge(oldData, project);
  await db.put(DATABASE_CONFIG.name, newData, id);
}

export async function getProjectList(): Promise<Project[]> {
  const db = await openDatabase();
  return await db.getAll(DATABASE_CONFIG.name);
}

export async function getProject(id: number): Promise<Project | null> {
  const db = await openDatabase();
  return await db.get(DATABASE_CONFIG.name, id);
}
