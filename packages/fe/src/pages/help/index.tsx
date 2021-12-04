import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Layout } from 'antd';
import PageContent from '@/components/PageContent';
import Markdown from 'markdown-to-jsx';
import 'github-markdown-css';

const content = `# 摸鱼提词器使用帮助

摸鱼提词器是我自己开发出的一个可以远程控制、工程管理的提词器。起因是感觉市面上的提词器软件不太好用，就自己开发了一个。

# 功能介绍

+ 可远程控制
+ 能保存工程到本地
+ 也支持纯本地提词器
+ 支持镜像翻转、字号调整、速度调整等基础功能
+ 断开自动重连

# 使用帮助

一共有四个页面，分别是首页、遥控器、显示器和仅本地。

## 首页

![](https://pic.imgdb.cn/item/61ab0c032ab3f51d91388e4b.jpg)

第一次进入首页，会弹出提醒安装应用的通知，建议安装应用到本地，以提供接近原生 APP 的使用体验。

进入首页后，建议将设备切换为**横屏**模式，然后点击**切换全屏**进入全屏模式。

## 远程控制

点击遥控器按钮后，会弹出工程管理器。

![](https://pic.imgdb.cn/item/61ab0dba2ab3f51d91398d3e.jpg)

第一次打开时，你可以新建工程，点击中间的“新建”按钮，或者是弹窗左下角的“新建”按钮都可以新建工程。

![](https://pic.imgdb.cn/item/61ab0e6c2ab3f51d9139f9ad.jpg)

新建工程完成后，你可以选中一个工程，进行编辑、删除操作。如果没有问题，你可以双击工程文件或者选中后点击右下角的“打开”按钮来打开你的工程。

![](https://pic.imgdb.cn/item/61ab0efd2ab3f51d913a5014.jpg)

工程数据将保存在遥控器所在的设备中。

打开工程后，就会进入遥控器页面了。

![](https://pic.imgdb.cn/item/61ab0f752ab3f51d913a8a1b.jpg)

左上角是返回到主页的按钮，中间是输入显示器页面上显示的连接码处，右上角分别是全屏按钮的连接状态指示灯。

这里假设你在另一台作为提词器的设备上打开了显示器页面，顶部会有该设备的连接码。

现在你需要在遥控器页面的顶部输入这个连接码，如果没问题的话，两台设备都会出现“连接成功”的提示。

连接成功后页面如下：

遥控器：

![](https://pic.imgdb.cn/item/61ab10c82ab3f51d913b472d.png)

显示器：

![](https://pic.imgdb.cn/item/61ab10bc2ab3f51d913b3f51.jpg)

遥控器中左边的两个滑条分别是控制字体大小和滚动速度的。

中间两个按钮分别是控制是否显示进度条（即显示器中间半透明蓝色的进度条）和是否垂直翻转（镜像），

右边是触摸板，具体操作为：

+ 点击：启动、暂停提词器滚动。
+ 上下滑动：调整文本位置。

至此，你就可以远程控制提词器了。如果你需要断开连接，可以退出页面或者点击上方的“断开”按钮。

# 仅本地

摸鱼提词器也提供仅在本地使用的功能。

在主页点击“仅本地”按钮，也会弹出工程管理器，用法在上面已经描述过了，不再赘述。

![](https://pic.imgdb.cn/item/61ab12642ab3f51d913c454e.jpg)

左上角为返回到主页的按钮，中间为控制条，可以控制字号、速度、翻转、显示进度条等参数。

此外还有两个按钮为返回到开始位置和全屏。

右上角为剩余时间。

提词器控制方法：

+ 点击：切换滚动、暂停滚动。
+ 上下滑动：控制文本位置。

# 数据存储与安全

本应用使用到了 Web Storage 和 IndexedDB 技术来存储工程数据、设置等信息。

## 遥控器

遥控器页面将存储工程信息到本地，初始配置同步显示器的配置。

### 安全风险提示

遥控器将会发送你的工程内容给显示器，将经过服务器，但我们不会存储你的数据到服务器。

你的数据传输将经过 TLS 加密后再进行传输，理论上已经是非常安全的了。

如果你的数据保密程度较高，仍然不愿意经过网络传输，你可以选择仅本地模式，本地模式的数据不经过任何网络传输。

## 显示器

显示器页面将存储配置信息到本地，并发送配置给遥控器用于同步遥控器侧的配置。

## 仅本地

仅本地将存储工程信息、配置信息到本地，不经过任何网络传输。

# 最后

该项目为开源项目，你可以在 [GitHub](https://github.com/MoyuScript/moyu-prompt) 上查看。

如果你发现有 BUG，或者想添加一些新功能，欢迎在 [Issue](https://github.com/MoyuScript/moyu-prompt/issues) 页面提出。

如果你不会使用 GitHub，也可以给我发电子邮件 [i@moyu.moe](mailto:i@moyu.moe?subject=【摸鱼提词器】此处填写你的标题)
`;

export interface HelpPageProps {}

const HelpPage: React.FC<HelpPageProps> = () => {
  return (
    <>
      <Layout>
        <PageHeader center={'帮助'} />
        <PageContent>
          <div style={{padding: '0 4vw 10vw', color: '#d0d0d0', background: 'black', maxWidth: '1000px', margin: '0 auto'}} className='markdown-body'>
            <Markdown>{content}</Markdown>
          </div>
        </PageContent>
      </Layout>
    </>
  );
};

export default HelpPage;
