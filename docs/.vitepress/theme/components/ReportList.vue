<script setup>
import { ref, computed } from 'vue'
import { data as reports } from '../../data/reports.data'

const selectedCategory = ref('all')

const categories = computed(() => {
  const cats = new Set(reports.map(r => r.category))
  return ['all', ...Array.from(cats).sort()]
})

const categoryLabels = {
  all: '全部',
  ai: 'AI',
  crypto: '加密货币',
  finance: '金融',
}

const filteredReports = computed(() => {
  const list = selectedCategory.value === 'all'
    ? reports
    : reports.filter(r => r.category === selectedCategory.value)
  return list.sort((a, b) => b.date.localeCompare(a.date))
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="report-list">
    <div class="filters">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ categoryLabels[cat] || cat }}
      </button>
    </div>

    <div v-if="filteredReports.length === 0" class="empty">
      暂无报告
    </div>

    <div v-for="report in filteredReports" :key="report.url" class="report-card">
      <div class="report-meta">
        <span class="report-date">{{ formatDate(report.date) }}</span>
        <span class="report-category">{{ categoryLabels[report.category] || report.category }}</span>
      </div>
      <h3>
        <a :href="report.url">{{ report.title }}</a>
      </h3>
      <p v-if="report.description" class="report-desc">{{ report.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.report-list {
  margin-top: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.4rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 1rem;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.report-card {
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.report-card:last-child {
  border-bottom: none;
}

.report-meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
}

.report-date {
  color: var(--vp-c-text-2);
}

.report-category {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.report-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.report-card h3 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.report-card h3 a:hover {
  color: var(--vp-c-brand-1);
}

.report-desc {
  margin: 0.4rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.empty {
  color: var(--vp-c-text-2);
  padding: 2rem 0;
  text-align: center;
}
</style>
