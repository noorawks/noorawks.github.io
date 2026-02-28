<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-container">
        <h1 class="hero-title">
          Hi, I'm <span class="gradient-text">Noor Muhammad Reza</span>
        </h1>
        <p class="hero-subtitle">Full Stack Engineer</p>
        <p class="hero-description">Building elegant solutions to complex problems</p>
        
        <div class="hero-cta">
          <router-link to="/projects" class="btn-primary">View Projects</router-link>
          <router-link to="/contact" class="btn-secondary">Get In Touch</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section {
  width: 100%;
  padding: 2rem;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: rgb(79, 70, 229);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
}

.btn-primary:hover {
  background-color: rgb(67, 56, 202);
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover {
  background-color: rgb(30, 41, 59);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 300px;
    text-align: center;
  }
}
</style>
