import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI 资讯中心',
  description: '深度研究报告与行业洞察',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '研究报告', link: '/reports/' },
    ],

    sidebar: {
      '/reports/': [
        {
          text: '研究报告',
          items: [
            { text: '报告总览', link: '/reports/' },
          ]
        }
      ],
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  }
})
