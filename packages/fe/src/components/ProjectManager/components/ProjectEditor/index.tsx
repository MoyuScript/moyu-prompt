import { Project } from '@/common/project';
import React, { useState } from 'react';
import styles from './index.less';
import { Modal, Form, Input } from 'antd';
import { merge } from 'lodash';

export interface ProjectEditorProps {
  onChange: (project: Project) => void
  initialData: Project
};

const ProjectEditorModal: React.FC<ProjectEditorProps> = ({ onChange, initialData }) => {
  const [values, setValues] = useState(initialData);

  return <Form onValuesChange={(changedValues) => setValues(old => {
    const newValue = merge(old, changedValues);
    onChange(newValue);

    return newValue;
  })} layout='vertical'>
    <Form.Item name='name' label='工程名' required>
      <Input defaultValue={initialData.name}/>
    </Form.Item>
    <Form.Item name='content' label='内容' required>
      <Input.TextArea defaultValue={initialData.content} autoSize showCount/>
    </Form.Item>
  </Form>;
};

export default ProjectEditorModal;
