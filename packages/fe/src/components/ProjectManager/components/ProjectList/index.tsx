import { Project } from '@/common/project';
import { useEffect } from '@umijs/renderer-react/node_modules/@types/react';
import React, { useState } from 'react';
import styles from './index.less';

export interface ActionEvent {
  name: 'open' | 'delete' | 'edit'
  project: Project
}

export interface ProjectListProps {
  projects: Project[]
  onAction: (action: ActionEvent) => void
  onPickChange: (project: Project) => void
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAction, onPickChange }) => {
  const [pickedProject, setPickedProject] = useState<Project | null>(null);

  return <div className={styles.projectList}>
    {projects.map((v) => (
      <div key={v.id} className={`${styles.item} ${pickedProject ? (pickedProject.id === v.id ? styles.pick : '') : ''}`}
        onClick={() => {
          setPickedProject(v);
          onPickChange(v);
        }}
        onDoubleClick={() => onAction({name: 'open', project: v})}>
        <div className={styles.text}>{v.content}</div>
        <div className={styles.name}>{v.name}</div>
      </div>
    ))}
  </div>;
};

export default ProjectList;
