<template>
  <div class="project-detail-view">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading project...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <router-link to="/projects" class="back-button">← Back to Projects</router-link>
    </div>
    
    <div v-else-if="projectDetail" class="project-container">
      <!-- Back Button -->
      <router-link to="/projects" class="back-link">
        ← Back to Projects
      </router-link>
      
      <!-- Project Header -->
      <div class="project-header">
        <h1 class="project-title">{{ projectDetail.title }}</h1>
        <div class="project-meta">
          <div v-if="projectDetail.role" class="meta-item">
            <strong>Role:</strong> {{ projectDetail.role }}
          </div>
          <div v-if="projectDetail.period" class="meta-item">
            <strong>Period:</strong> {{ projectDetail.period }}
          </div>
        </div>
        <div class="project-meta">
          <div v-if="projectDetail.techStack" class="meta-item tech-stack-meta">
            <strong>Tech Stack:</strong>
            <div class="tech-stack-inline">
              <span 
                v-for="tech in parseTechStack(projectDetail.techStack)" 
                :key="tech"
                class="tech-badge-inline"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Executive Summary -->
      <section v-if="projectDetail.executiveSummary" class="content-section">
        <h2 class="section-title">Overview</h2>
        <div class="section-content" v-html="projectDetail.executiveSummary"></div>
      </section>
      
      <!-- Key Technical Achievements -->
      <section v-if="projectDetail.achievements && projectDetail.achievements.length > 0" class="content-section">
        <h2 class="section-title">Key Technical Achievements</h2>
        <div class="achievements-grid">
          <div 
            v-for="(achievement, index) in projectDetail.achievements" 
            :key="index"
            class="achievement-card"
          >
            <h3 class="achievement-title">{{ index + 1 }}. {{ achievement.title }}</h3>
            
            <div v-if="achievement.challenge" class="achievement-block">
              <h4 class="block-label">Challenge</h4>
              <p class="block-text">{{ achievement.challenge }}</p>
            </div>
            
            <div v-if="achievement.solution" class="achievement-block">
              <h4 class="block-label">Solution</h4>
              <div class="block-text" v-html="achievement.solution"></div>
            </div>
            
            <div v-if="achievement.result" class="achievement-result">
              <strong>Result:</strong> {{ achievement.result }}
            </div>
          </div>
        </div>
      </section>
      
      <!-- Impact & Metrics -->
      <section v-if="projectDetail.impact" class="content-section">
        <h2 class="section-title">Impact & Metrics</h2>
        <div class="section-content metrics-content" v-html="projectDetail.impact"></div>
      </section>
      
      <!-- Project Duration -->
      <section v-if="projectDetail.duration" class="content-section">
        <h2 class="section-title">Project Duration</h2>
        <div class="section-content" v-html="projectDetail.duration"></div>
      </section>
      
      <!-- Team & Collaboration -->
      <section v-if="projectDetail.team" class="content-section">
        <h2 class="section-title">Team & Collaboration</h2>
        <div class="section-content" v-html="projectDetail.team"></div>
      </section>
      
      <!-- Lessons Learned -->
      <section v-if="projectDetail.lessonsLearned" class="content-section">
        <h2 class="section-title">Lessons Learned</h2>
        <div class="section-content" v-html="projectDetail.lessonsLearned"></div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ContentReader } from '@/services/ContentReader'

const route = useRoute()
const contentReader = new ContentReader()
const isLoading = ref(true)
const error = ref<string | null>(null)
const projectDetail = ref<any>(null)

const loadProjectDetail = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const slug = route.params.slug as string
    projectDetail.value = await contentReader.loadProjectDetail(slug)
  } catch (err: any) {
    error.value = err.message || 'Failed to load project details'
    console.error('Error loading project detail:', err)
  } finally {
    isLoading.value = false
  }
}

const parseTechStack = (techStack: string): string[] => {
  return techStack
    .split(',')
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0)
}

watch(() => route.params.slug, () => {
  if (route.params.slug) {
    loadProjectDetail()
  }
})

onMounted(() => {
  loadProjectDetail()
})
</script>

<style scoped>
.project-detail-view {
  min-height: 100vh;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 64px;
  height: 64px;
  border: 5px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin: 0;
  font-weight: 500;
}

.error-message {
  color: var(--color-danger);
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  max-width: 500px;
  font-weight: 600;
}

.back-button {
  padding: 1rem 2.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid));
  border: none;
  border-radius: var(--radius-lg);
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}

/* Project Container */
.project-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 8rem 1.5rem 5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgb(129, 140, 248);
  text-decoration: none;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: rgb(167, 139, 250);
  transform: translateX(-4px);
}

/* Project Header */
.project-header {
  margin-bottom: 3rem;
}

.project-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(226, 232, 240);
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-item {
  font-size: 1rem;
  color: rgb(148, 163, 184);
  line-height: 1.6;
}

.meta-item strong {
  color: rgb(129, 140, 248);
  font-weight: 600;
}

.tech-stack-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-stack-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-badge-inline {
  font-size: 0.875rem;
  color: rgb(226, 232, 240);
  background: rgba(99, 102, 241, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-weight: 500;
}

/* Content Sections */
.content-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgb(226, 232, 240);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(99, 102, 241, 0.3);
}

.section-content {
  font-size: 1rem;
  color: rgb(148, 163, 184);
  line-height: 1.8;
}

.section-content :deep(p) {
  margin: 0 0 1rem 0;
}

.section-content :deep(ul) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.section-content :deep(li) {
  margin-bottom: 0.5rem;
}

.section-content :deep(strong) {
  color: rgb(226, 232, 240);
  font-weight: 600;
}

.metrics-content :deep(ul) {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.metrics-content :deep(li) {
  background: rgba(30, 41, 59, 0.5);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  border-left: 3px solid rgb(99, 102, 241);
}

/* Achievements Grid */
.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.achievement-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
}

.achievement-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(226, 232, 240);
  margin: 0 0 1.5rem 0;
}

.achievement-block {
  margin-bottom: 1.5rem;
}

.block-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(129, 140, 248);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 0;
}

.block-text {
  font-size: 1rem;
  color: rgb(148, 163, 184);
  line-height: 1.7;
  margin: 0;
}

.block-text :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.block-text :deep(li) {
  margin-bottom: 0.375rem;
}

.achievement-result {
  font-size: 1rem;
  color: rgb(148, 163, 184);
  padding: 1rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 0.5rem;
  border-left: 3px solid rgb(99, 102, 241);
}

.achievement-result strong {
  color: rgb(129, 140, 248);
}

/* Tech Grid */
.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-tag {
  font-size: 0.9375rem;
  color: rgb(226, 232, 240);
  background: rgba(99, 102, 241, 0.15);
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-weight: 500;
}

/* Tablet */
@media (min-width: 768px) {
  .project-meta {
    flex-direction: row;
    gap: 2rem;
  }

  .metrics-content :deep(ul) {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .project-container {
    padding: 8rem 3rem 5rem;
  }

  .project-title {
    font-size: 3rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .project-container {
    padding: 5rem 1.5rem 3rem;
  }

  .project-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .achievement-card {
    padding: 1.5rem;
  }

  .achievement-title {
    font-size: 1.125rem;
  }
}
</style>
