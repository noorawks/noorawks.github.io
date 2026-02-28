<template>
  <div class="skills-view">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading skills...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="retry-button">Retry</button>
    </div>
    
    <div v-else class="skills-container">
      <h1 class="page-title">Skills & Technologies</h1>
      
      <div class="skills-grid">
        <div 
          v-for="(category, index) in skillsData.categories" 
          :key="index"
          class="skill-category-card"
        >
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="category-divider"></div>
          <ul class="skills-list">
            <li 
              v-for="(skill, skillIndex) in category.skills" 
              :key="skillIndex"
              class="skill-item"
            >
              <span class="skill-indicator"></span>
              <span class="skill-name">{{ skill.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ContentReader } from '@/services/ContentReader'

const contentReader = new ContentReader()
const isLoading = ref(true)
const error = ref<string | null>(null)
const contentData = ref<any>(null)

const skillsData = computed(() => {
  if (!contentData.value) {
    return { categories: [] }
  }
  return contentData.value.skills
})

const loadContent = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    contentData.value = await contentReader.loadContent()
  } catch (err: any) {
    error.value = err.message || 'Failed to load skills'
    console.error('Error loading skills:', err)
  } finally {
    isLoading.value = false
  }
}

const retryLoad = () => {
  loadContent()
}

onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.skills-view {
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

.retry-button {
  padding: 1rem 2.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid));
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.retry-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}

.retry-button:active {
  transform: translateY(0);
}

/* Skills Container */
.skills-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1.5rem 5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  background: linear-gradient(to right, rgb(129, 140, 248), rgb(192, 132, 252));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.skill-category-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.skill-category-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(129, 140, 248);
  margin: 0 0 1rem 0;
}

.category-divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, rgb(99, 102, 241), transparent);
  margin-bottom: 1.5rem;
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: rgb(226, 232, 240);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.skill-item:hover {
  color: white;
  transform: translateX(8px);
}

.skill-indicator {
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, rgb(99, 102, 241), rgb(168, 85, 247));
  border-radius: 2px;
  flex-shrink: 0;
}

.skill-name {
  font-weight: 400;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .skills-container {
    padding: 8rem 3rem 5rem;
  }

  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  .page-title {
    font-size: 3rem;
  }
}

/* Mobile responsiveness */
@media (max-width: 767px) {
  .skills-container {
    padding: 5rem 1.5rem 3rem;
  }

  .page-title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  .skill-category-card {
    padding: 1.5rem;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .loading-state,
  .error-state {
    min-height: 60vh;
    padding: 1.5rem;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border-width: 4px;
  }

  .error-message {
    font-size: 1.125rem;
  }

  .retry-button {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}
</style>
