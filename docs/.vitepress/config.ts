import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync, statSync } from 'fs'
import { resolve, basename } from 'path'
import matter from 'gray-matter'

const categoryLabels: Record<string, string> = {
  ai: 'AI',
  crypto: '加密货币',
  finance: '金融',
}

function generateReportsSidebar() {
  const reportsDir = resolve(__dirname, '../reports')
  const sidebar: any[] = [
    { text: '全部报告', link: '/reports/' }
  ]

  // 第一层：大类（ai, crypto, finance）
  const categories = readdirSync(reportsDir).filter(name => {
    return statSync(resolve(reportsDir, name)).isDirectory()
  })

  for (const cat of categories.sort()) {
    const catDir = resolve(reportsDir, cat)

    // 第二层：标的（paypal, btc, llm...）
    const tickers = readdirSync(catDir).filter(name => {
      return statSync(resolve(catDir, name)).isDirectory()
    })

    const tickerGroups: any[] = []

    for (const ticker of tickers.sort()) {
      const tickerDir = resolve(catDir, ticker)
      const files = readdirSync(tickerDir).filter(f => f.endsWith('.md'))

      // 第三层：报告文件（按日期倒序）
      const items = files.map(file => {
        const content = readFileSync(resolve(tickerDir, file), 'utf-8')
        const { data: fm } = matter(content)
        const date = fm.date ? new Date(fm.date).toISOString().slice(0, 10) : '1970-01-01'
        return {
          text: `${date} ${fm.title || basename(file, '.md')}`,
          link: `/reports/${cat}/${ticker}/${basename(file, '.md')}`,
          date,
          ticker: fm.ticker || ticker,
        }
      }).sort((a, b) => b.date.localeCompare(a.date))

      if (items.length > 0) {
        tickerGroups.push({
          text: items[0].ticker,
          collapsed: false,
          items: items.map(({ text, link }) => ({ text, link })),
        })
      }
    }

    if (tickerGroups.length > 0) {
      sidebar.push({
        text: categoryLabels[cat] || cat,
        collapsed: false,
        items: tickerGroups,
      })
    }
  }

  return sidebar
}

/**
 * 修复 markdown-it 在 ** 紧邻 CJK 字符时无法识别 emphasis 边界的问题
 * 原因：当 ** 同时是 left-flanking 和 right-flanking 时，
 * CommonMark 要求前/后必须是标点才能 open/close emphasis，但 CJK 字符不算标点
 * 解决：在 ** 与 CJK 字符之间插入空格，破除双向 flanking
 */
function fixCjkEmphasis(src: string): string {
  const MO = '\ue000' // 占位符开始（Unicode 私用区）
  const MC = '\ue001' // 占位符结束

  // 用占位符保护 **...** 内容，避免内外空格混淆
  const bolds: string[] = []
  let result = src.replace(/\*\*([^*\n]+?)\*\*/g, (_, inner) => {
    bolds.push(inner)
    return `${MO}${bolds.length - 1}${MC}`
  })

  // 在占位符外侧与非空白字符之间加空格
  result = result.replace(new RegExp(`(\\S)${MO}`, 'g'), `$1 ${MO}`)
  result = result.replace(new RegExp(`${MC}(\\S)`, 'g'), `${MC} $1`)

  // 还原占位符为 **...**
  result = result.replace(new RegExp(`${MO}(\\d+)${MC}`, 'g'), (_, idx) => `**${bolds[parseInt(idx)]}**`)

  return result
}

export default defineConfig({
  title: 'AI 资讯中心',
  description: '深度研究报告与行业洞察',
  lang: 'zh-CN',

  markdown: {
    config(md) {
      // markdown-it 的 emphasis 规则在 ** 紧邻中文字符时无法识别边界
      // 拦截 parse 方法，在解析前给 ** 与 CJK 字符之间加空格
      const originalParse = md.parse.bind(md)
      md.parse = (src: string, env: any) => {
        return originalParse(fixCjkEmphasis(src), env)
      }
    }
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '研究报告', link: '/reports/' },
    ],

    sidebar: {
      '/reports/': generateReportsSidebar(),
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
