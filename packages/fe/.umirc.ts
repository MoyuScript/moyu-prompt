import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/pages/index/index',
      title: '摸鱼提词器'
    },
    {
      path: '/controller',
      component: '@/pages/controller/index',
      title: '遥控器 - 摸鱼提词器'
    },
    {
      path: '/displayer',
      component: '@/pages/displayer/index',
      title: '显示器 - 摸鱼提词器'
    },
    {
      path: '/help',
      component: '@/pages/help/index',
      title: '帮助 - 摸鱼提词器'
    },
    {
      path: '/local',
      component: '@/pages/local/index',
      title: '本地模式 - 摸鱼提词器'
    },
  ],
  fastRefresh: {},
  antd: {
    dark: true
  }
});
