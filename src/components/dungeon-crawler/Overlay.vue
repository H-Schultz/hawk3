<template>
  <div>
    <div v-if="gameState === GAME_STATE.VICTORY" class="victory-overlay">
      <div class="victory-content">
        <h2>You Win!</h2>
        <p>Congratulations!</p>
        <p>Münzen gesammelt: {{ coins }}</p>
        <p>Drücke 'R' zum Neustarten</p>
      </div>
    </div>

    <div v-if="gameState === GAME_STATE.GAME_OVER" class="game-over-overlay">
      <div class="game-over-content">
        <h2>Game Over</h2>
        <p>Münzen gesammelt: {{ coins }}</p>
        <p>Drücke 'R' zum Neustarten</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { GAME_STATE } from './constants.js';

  const props = defineProps({
    gameState: {
      type: String,
      required: true
    },
    coins: {
      type: Number,
      required: true
    }
  });
</script>

<style scoped>

.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.game-over-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  color: #000;
}

.game-over-content h2 {
  font-size: 32px;
  color: #ff0000;
  margin: 0 0 20px;
}

.game-over-content p {
  font-size: 18px;
  margin: 10px 0;
}

.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.victory-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  animation: victoryPulse 2s infinite;
  color: #000;
}

.victory-content h2 {
  font-size: 48px;
  color: #ffd700;
  margin: 0 0 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes victoryPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

</style>