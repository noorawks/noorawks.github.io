<template>
  <div class="about-view">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading content....</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="retry-button">Retry</button>
    </div>
    
    <div v-else class="about-container">
      <div class="about-layout">
        
        <div class="profile-column">
          <div class="profile-photo-container">
            <img 
              :src="aboutContent.photo" 
              alt="Profile photo"
              class="profile-photo"
            />
            <div class="profile-decoration"></div>
          </div>
        </div>

        <div class="content-column">
          
          <section class="bio-section">
            <div v-html="aboutContent.bio" class="bio-content"></div>
          </section>

          <section v-if="aboutContent.experience.length > 0" class="experience-section">
            <h2 class="section-title">
              <span class="title-decoration"></span>
              Experience
            </h2>
            
            <div class="timeline">
              <div 
                v-for="(exp, index) in aboutContent.experience" 
                :key="index"
                class="timeline-item"
              >
                <div :class="['timeline-dot', { 'active': index === 0 }]"></div>
                <div class="timeline-content">
                  <h3 class="timeline-title">{{ exp.title }}</h3>
                  <p class="timeline-meta">{{ exp.company }} | {{ exp.period }}</p>
                  <p class="timeline-description">{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section v-if="aboutContent.education.length > 0" class="education-section">
            <h2 class="section-title">
              <span class="title-decoration"></span>
              Education
            </h2>
            
            <div class="education-list">
              <div 
                v-for="(edu, index) in aboutContent.education" 
                :key="index"
                class="education-card"
              >
                <h3 class="education-degree">{{ edu.degree }}</h3>
                <p class="education-institution">{{ edu.institution }}</p>
                <p class="education-year">{{ edu.year }}</p>
              </div>
            </div>
          </section>

          <div class="action-buttons">
            <a href="/cv-noor-reza.html" target="_blank" class="btn-primary">Download CV</a>
            <router-link to="/contact" class="btn-secondary">Contact Me</router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ContentReader } from '@/services/ContentReader'
import type { AboutContent } from '@/types/content'

const contentReader = new ContentReader()
const isLoading = ref(true)
const error = ref<string | null>(null)
const contentData = ref<any>(null)

const aboutContent = computed<AboutContent>(() => {
  if (!contentData.value) {
    return {
      bio: '',
      photo: '',
      experience: [],
      education: []
    }
  }
  return contentData.value.about
})

const loadContent = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    contentData.value = await contentReader.loadContent()
  } catch (err: any) {
    error.value = err.message || 'Failed to load content'
    console.error('Error loading content:', err)
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
.about-view {
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

.about-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1.5rem 5rem;
}

.about-layout {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.profile-column {
  width: 100%;
  display: flex;
  justify-content: center;
}

.profile-photo-container {
  position: relative;
  display: inline-block;
}

.profile-photo {
  width: 256px;
  height: 256px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
  border: 4px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.profile-photo:hover {
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
}

.profile-decoration {
  position: absolute;
  inset: -0.5rem;
  background: linear-gradient(to top right, rgb(99, 102, 241), rgb(168, 85, 247));
  border-radius: 50%;
  opacity: 0.2;
  z-index: -1;
  filter: blur(24px);
  transition: opacity 0.3s ease;
}

.profile-photo-container:hover .profile-decoration {
  opacity: 0.3;
}

.content-column {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.bio-section {
  margin-bottom: 0;
}

.bio-content {
  font-size: 1.125rem;
  line-height: 1.75;
  color: rgb(148, 163, 184);
  max-width: 48rem;
}

.bio-content :deep(h1) {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.bio-content :deep(h1 strong) {
  background: linear-gradient(to right, rgb(129, 140, 248), rgb(192, 132, 252));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bio-content :deep(p) {
  margin: 1rem 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title-decoration {
  width: 2rem;
  height: 2px;
  background-color: rgb(99, 102, 241);
  margin-right: 1rem;
}

.experience-section {
  margin-top: 0;
}

.timeline {
  position: relative;
  padding-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: rgb(30, 41, 59);
}

.timeline-item {
  position: relative;
  padding-left: 0;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgb(51, 65, 85);
  border: 2px solid rgb(15, 23, 42);
  z-index: 1;
}

.timeline-dot.active {
  background-color: rgb(99, 102, 241);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
  border-color: rgb(15, 23, 42);
}

.timeline-content {
  padding-left: 0;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.timeline-meta {
  font-size: 1rem;
  color: rgb(129, 140, 248);
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.timeline-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgb(148, 163, 184);
  margin: 0;
}

.education-section {
  margin-top: 0;
}

.education-list {
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.education-card {
  background-color: rgba(30, 41, 59, 0.5);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease;
}

.education-card:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

.education-degree {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.education-institution {
  font-size: 1rem;
  color: rgb(129, 140, 248);
  margin: 0 0 0.25rem 0;
}

.education-year {
  font-size: 0.875rem;
  color: rgb(100, 116, 139);
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

.btn-primary {
  background-color: rgb(79, 70, 229);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary:hover {
  background-color: rgb(67, 56, 202);
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-secondary:hover {
  background-color: rgb(30, 41, 59);
  transform: translateY(-2px);
}

@media (min-width: 1024px) {
  .about-container {
    padding: 8rem 3rem 5rem;
  }

  .about-layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 5rem;
  }

  .profile-column {
    width: 33.333333%;
    position: sticky;
    top: 8rem;
  }

  .profile-photo {
    width: 320px;
    height: 320px;
  }

  .content-column {
    width: 66.666667%;
  }

  .bio-content :deep(h1) {
    font-size: 3rem;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .about-container {
    padding: 6rem 2rem 4rem;
  }

  .profile-photo {
    width: 240px;
    height: 240px;
  }

  .bio-content :deep(h1) {
    font-size: 2.5rem;
  }
}

@media (max-width: 767px) {
  .about-container {
    padding: 5rem 1.5rem 3rem;
  }

  .about-layout {
    gap: 2rem;
  }

  .profile-photo {
    width: 256px;
    height: 256px;
  }

  .bio-content {
    font-size: 1rem;
  }

  .bio-content :deep(h1) {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .timeline-title {
    font-size: 1.125rem;
  }

  .education-degree {
    font-size: 1.125rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>
