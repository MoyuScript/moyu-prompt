import type {UserConfig} from '@commitlint/types';

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    'subject-case': [0],
  }
};

export default config
