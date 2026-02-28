<template>
  <div class="projects-view">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading projects...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="retry-button">Retry</button>
    </div>
    
    <div v-else class="projects-container">
      <h1 class="page-title">Projects</h1>
      <p class="page-subtitle">Explore my work and technical achievements</p>
      
      <!-- Tech Stack Filters -->
      <div class="filters-section">
        <button 
          :class="['filter-btn', { active: selectedTech === null }]"
          @click="selectedTech = null"
        >
          All
        </button>
        <button 
          v-for="tech in allTechnologies" 
          :key="tech"
          :class="['filter-btn', { active: selectedTech === tech }]"
          @click="selectedTech = tech"
        >
          {{ tech }}
        </button>
      </div>
      
      <!-- Projects Grid -->
      <div v-if="filteredProjects.length > 0" class="projects-grid">
        <router-link 
          v-for="project in filteredProjects" 
          :key="project.id"
          :to="`/projects/${project.slug}`"
          class="project-card"
        >
          <div class="card-header">
            <h2 class="project-name">{{ project.name }}</h2>
            <span v-if="project.date" class="project-date">{{ project.date }}</span>
          </div>
          
          <p class="project-description">{{ project.description }}</p>
          
          <div class="tech-stack">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="tech-badge"
            >
              {{ tech }}
            </span>
          </div>
          
          <div class="card-footer">
            <span class="view-details">View Details →</span>
          </div>
        </router-link>
      </div>
      
      <div v-else class="empty-state">
        <p>No projects found with "{{ selectedTech }}"</p>
        <button @click="selectedTech = null" class="reset-filter-btn">Show All Projects</button>
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
const projects = ref<any[]>([])
const selectedTech = ref<string | null>(null)

const allTechnologies = computed(() => {
  const techSet = new Set<string>()
  projects.value.forEach(project => {
    project.technologies?.forEach((tech: string) => techSet.add(tech))
  })
  return Array.from(techSet).sort()
})

const filteredProjects = computed(() => {
  if (!selectedTech.value) {
    return projects.value
  }
  return projects.value.filter(project => 
    project.technologies?.includes(selectedTech.value)
  )
})

const loadProjects = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    projects.value = await contentReader.loadProjectsFromFolder()
  } catch (err: any) {
    error.value = err.message || 'Failed to load projects'
    console.error('Error loading projects:', err)
  } finally {
    isLoading.value = false
  }
}

const retryLoad = () => {
  loadProjects()
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.projects-view {
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

/* Projects Container */
.projects-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1.5rem 5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(to right, rgb(129, 140, 248), rgb(192, 132, 252));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: rgb(148, 163, 184);
  margin-bottom: 3rem;
  font-weight: 400;
}

/* Filters Section */
.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.filter-btn {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgb(148, 163, 184);
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.filter-btn:hover {
  color: rgb(226, 232, 240);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.filter-btn.active {
  color: white;
  background: linear-gradient(135deg, rgb(99, 102, 241), rgb(168, 85, 247));
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.project-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.25rem;
  padding: 2rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.project-card:hover::before {
  transform: scaleX(1);
}

.project-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(226, 232, 240);
  margin: 0;
  flex: 1;
}

.project-date {
  font-size: 0.875rem;
  color: rgb(148, 163, 184);
  white-space: nowrap;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 0.5rem;
}

.project-description {
  font-size: 1rem;
  color: rgb(148, 163, 184);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex: 1;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-badge {
  font-size: 0.8125rem;
  color: rgb(129, 140, 248);
  background: rgba(99, 102, 241, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.view-details {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(129, 140, 248);
  transition: all 0.3s ease;
}

.project-card:hover .view-details {
  color: rgb(167, 139, 250);
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state p {
  font-size: 1.125rem;
  color: rgb(148, 163, 184);
  margin-bottom: 1.5rem;
}

.reset-filter-btn {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, rgb(99, 102, 241), rgb(168, 85, 247));
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

/* Tablet */
@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .projects-container {
    padding: 8rem 3rem 5rem;
  }

  .page-title {
    font-size: 3rem;
  }

  .page-subtitle {
    font-size: 1.25rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .projects-container {
    padding: 5rem 1.5rem 3rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .filters-section {
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .project-card {
    padding: 1.5rem;
  }

  .project-name {
    font-size: 1.25rem;
  }

  .card-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .project-date {
    align-self: flex-start;
  }
}
</style>
