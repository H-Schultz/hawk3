<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  player: {
    type: Object,
    required: true
  },
  dungeonMap: {
    type: Array,
    required: true
  },
  viewportWidth: {
    type: Number,
    default: 11
  },
  viewportHeight: {
    type: Number,
    default: 7
  },
  tileSize: {
    type: Number,
    default: 64
  }
});

const camera = computed(() => {
  const mapWidth = props.dungeonMap[0]?.length || 0;
  const mapHeight = props.dungeonMap.length || 0;

  // Center camera on player
  let cameraX = props.player.position.x - Math.floor(props.viewportWidth / 2);
  let cameraY = props.player.position.y - Math.floor(props.viewportHeight / 2);

  // Clamp camera to map boundaries
  cameraX = Math.max(0, Math.min(cameraX, mapWidth - props.viewportWidth));
  cameraY = Math.max(0, Math.min(cameraY, mapHeight - props.viewportHeight));

  return {
    x: cameraX,
    y: cameraY
  };
});

const visibleTiles = computed(() => {
  return props.dungeonMap.slice(
      camera.value.y,
      camera.value.y + props.viewportHeight
  ).map(row =>
      row.slice(camera.value.x, camera.value.x + props.viewportWidth)
  );
});

const getRelativePosition = (worldX, worldY) => {
  return {
    x: (worldX - camera.value.x) * props.tileSize,
    y: (worldY - camera.value.y) * props.tileSize
  };
};

// Expose getRelativePosition for parent components
defineExpose({ getRelativePosition });
</script>

<template>
  <div
    class="camera-viewport"
    :style="{
      width: `${viewportWidth * tileSize}px`,
      height: `${viewportHeight * tileSize}px`
    }"
  >
    <div
      class="game-world"
      :style="{
        transform: `translate(${-camera.x * tileSize}px, ${-camera.y * tileSize}px)`
      }"
    >
      <slot :camera="camera" :getRelativePosition="getRelativePosition"></slot>
    </div>
  </div>
</template>

<style scoped>
  .camera-viewport {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    image-rendering: pixelated;
    border: 4px solid #fff;
  }

  .camera-viewportxx::after {
    content: '';
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 400;
    box-shadow: inset 0 0 20px 20px rgba(0, 0, 0, 0.5);
  }

  .game-world {
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.4s ease;
  }

  .flip-out .game-world {
    opacity: 0;
  }

  .flip-in .game-world {
    opacity: 1;
  }

</style>