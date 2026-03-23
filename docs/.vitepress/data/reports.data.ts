import { createContentLoader } from 'vitepress'

interface ReportData {
  title: string
  url: string
  date: string
  category: string
  ticker: string
  description: string
}

export default createContentLoader('reports/**/*.md', {
  transform(rawData): ReportData[] {
    return rawData
      .filter(page => page.url !== '/reports/')
      .map(page => ({
        title: page.frontmatter.title || '未命名报告',
        url: page.url,
        date: page.frontmatter.date
          ? new Date(page.frontmatter.date).toISOString().slice(0, 10)
          : '1970-01-01',
        category: page.frontmatter.category || 'uncategorized',
        ticker: page.frontmatter.ticker || '',
        description: page.frontmatter.description || '',
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

export declare const data: ReportData[]
