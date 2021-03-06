import { defineConfig } from 'umi';
import { GenerateSW, InjectManifest } from 'workbox-webpack-plugin';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: 'assets/logo@64x64.jpg',
  routes: [
    {
      path: '/',
      component: '@/pages/index/index',
      title: '摸鱼提词器',
    },
    {
      path: '/controller',
      component: '@/pages/controller/index',
      title: '遥控器 - 摸鱼提词器',
    },
    {
      path: '/displayer',
      component: '@/pages/displayer/index',
      title: '显示器 - 摸鱼提词器',
    },
    {
      path: '/help',
      component: '@/pages/help/index',
      title: '帮助 - 摸鱼提词器',
    },
    {
      path: '/local',
      component: '@/pages/local/index',
      title: '本地模式 - 摸鱼提词器',
    },
  ],
  chainWebpack(memo) {
    memo.plugin('workbox-generate-sw').use(GenerateSW, [
      {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    ]);
  },
  fastRefresh: {},
  antd: {
    dark: true,
  },
  history: {
    type: 'hash',
  },
  webpack5: {},
});
