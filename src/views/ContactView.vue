<template>
  <div class="contact-view">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading contact info...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="retry-button">Retry</button>
    </div>
    
    <div v-else class="contact-container">
      <h1 class="page-title">Get In Touch</h1>
      <p class="page-subtitle">Feel free to reach out through any of these channels</p>
      
      <div class="contact-cards">
        <a 
          v-if="contactData.email" 
          :href="`mailto:${contactData.email}`"
          class="contact-card email-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <h2 class="card-title">Email</h2>
          <p class="card-value">{{ contactData.email }}</p>
          <span class="card-action">Send email →</span>
        </a>

        <a 
          v-if="contactData.linkedin" 
          :href="contactData.linkedin"
          class="contact-card linkedin-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </div>
          <h2 class="card-title">LinkedIn</h2>
          <p class="card-value">Connect with me</p>
          <span class="card-action">View profile →</span>
        </a>

        <a 
          v-if="contactData.github" 
          :href="contactData.github"
          class="contact-card github-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </div>
          <h2 class="card-title">GitHub</h2>
          <p class="card-value">Check out my code</p>
          <span class="card-action">View repos →</span>
        </a>
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

const contactData = computed(() => {
  if (!contentData.value) {
    return { email: '', linkedin: '', github: '' }
  }
  return contentData.value.contact
})

const loadContent = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    contentData.value = await contentReader.loadContent()
  } catch (err: any) {
    error.value = err.message || 'Failed to load contact info'
    console.error('Error loading contact:', err)
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
.contact-view {
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

/* Contact Container */
.contact-container {
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
  margin-bottom: 4rem;
  font-weight: 400;
}

/* Contact Cards */
.contact-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.contact-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.25rem;
  padding: 2rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.contact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.contact-card:hover::before {
  transform: scaleX(1);
}

.contact-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  border: 2px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.contact-card:hover .card-icon {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border-color: rgba(99, 102, 241, 0.4);
  transform: scale(1.1) rotate(5deg);
}

.card-icon svg {
  color: rgb(129, 140, 248);
  transition: all 0.3s ease;
}

.contact-card:hover .card-icon svg {
  color: rgb(167, 139, 250);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(226, 232, 240);
  margin: 0 0 0.5rem 0;
}

.card-value {
  font-size: 0.9375rem;
  color: rgb(148, 163, 184);
  margin: 0 0 1rem 0;
  word-break: break-all;
}

.card-action {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(129, 140, 248);
  transition: all 0.3s ease;
}

.contact-card:hover .card-action {
  color: rgb(167, 139, 250);
  transform: translateX(4px);
}

/* Tablet: 2 columns for LinkedIn and GitHub */
@media (min-width: 768px) {
  .contact-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop: Better layout */
@media (min-width: 1024px) {
  .contact-container {
    padding: 8rem 3rem 5rem;
  }

  .page-title {
    font-size: 3rem;
  }

  .page-subtitle {
    font-size: 1.25rem;
  }

  .contact-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* Mobile responsiveness */
@media (max-width: 767px) {
  .contact-container {
    padding: 5rem 1.5rem 3rem;
  }

  .page-title {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .page-subtitle {
    font-size: 1rem;
    margin-bottom: 3rem;
  }

  .contact-card {
    padding: 2rem 1.5rem;
  }

  .card-icon {
    width: 56px;
    height: 56px;
  }

  .card-icon svg {
    width: 24px;
    height: 24px;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .card-value {
    font-size: 0.9375rem;
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
