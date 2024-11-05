<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="header">
      <button
        @click="toggleTheme"
        class="theme-toggle"
        aria-label="Toggle theme"
      >
        <span v-if="isDarkMode" class="icon">🌞</span>
        <span v-else class="icon">🌙</span>
      </button>
      <h1 class="title">HAWK3</h1>
      <div class="header-line"></div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="games-grid">
        <!-- Game Tile -->
        <div
            class="game-tile"
            @click="startDungeonCrawler"
        >
          <div class="neon-line"></div>
          <h2 class="game-title">Dungeon Crawler</h2>
          <div class="pixel-grid">
            <div v-for="n in 9" :key="n" class="pixel"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2024 HAWK3 Games</p>
      <div class="footer-line"></div>
    </footer>
  </div>
</template>

<script setup>
import {ref, watchEffect, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()
const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Update data-theme attribute on body
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
})

const startDungeonCrawler = () => {
  router.push('/dungeon-crawler')
}

onMounted(() => {
  // Theme aus localStorage oder System-Präferenz laden
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>

<style scoped>
/* Header Styles */
.header {
  padding: 1rem;
  border-bottom: 4px solid var(--border-color);
  position: relative;
}

.theme-toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--hover-color);
}

.icon {
  font-size: 1.5rem;
}

.title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  font-family: monospace;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.header-line {
  width: 100%;
  height: 2px;
  background-color: var(--border-color);
}

/* Main Content Styles */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.games-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.game-tile {
  width: 16rem;
  height: 16rem;
  border: 4px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--tile-bg);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.game-tile:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--border-color);
}

.neon-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--border-color), #ff00ff);
}

.game-title {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: monospace;
  margin-bottom: 1rem;
}

.pixel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
  margin-top: 1rem;
}

.pixel {
  width: 0.75rem;
  height: 0.75rem;
  background-color: var(--border-color);
  border-radius: 2px;
}

/* Footer Styles */
.footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 4px solid var(--border-color);
  text-align: center;
  font-family: monospace;
}

.footer-line {
  width: 100%;
  height: 2px;
  background-color: var(--border-color);
  margin-top: 0.5rem;
}

/* Scanline Effect */
@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

[data-theme="dark"] #app::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      0deg,
      transparent 0%,
      rgba(32, 32, 32, 0.05) 50%,
      transparent 100%
  );
  animation: scanline 8s linear infinite;
  pointer-events: none;
}
</style>