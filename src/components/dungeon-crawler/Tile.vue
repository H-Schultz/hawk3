<template>
  <div class="tile" :style="getTileStyle(tile)">
    <div class="layer" v-if="props.tileObject?.layer" :style="getTileStyle(props.tileObject.layer)" />
  </div>
</template>

<script setup>
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
  import { TILES, DISPLAY_SIZE, ANIMATION_SPEED } from './constants.js';
  import { ref, onUnmounted, watch } from "vue";

  const props = defineProps({
    tile: {
      type: Number,
      required: true
    },
    tileObject: {
      type: Object,
      required: false
    }
  });

  const currentFrame = ref(0);
  let animationInterval;

  watch(
    () => props.tileObject?.status,
    (newStatus) => {
      if (newStatus) {
        currentFrame.value = 0;
        startAnimation();
      }
    }
  );

  const getTileStyle = (tileType) => {
    const position = TILES[tileType];
    if (!position) return {};

    let sprite = TILES[tileType];
    let frameX = sprite.x;
    if (props.tileObject?.status) {
      const maxFrames = TILES[tileType].sprites[props.tileObject.status].length;
      if (currentFrame.value >= maxFrames) {
        currentFrame.value = maxFrames - 1;
        clearInterval(animationInterval);
      }
      sprite = TILES[tileType].sprites[props.tileObject.status][currentFrame.value];
      frameX = sprite.x;
    } else if (props.tileObject?.frames) {
      frameX += currentFrame.value * sprite.frameOffset;
    }

    return {
      width: `${DISPLAY_SIZE}px`,
      height: `${DISPLAY_SIZE}px`,
      zIndex: position.zIndex,
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${frameX * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
    };
  };

  const startAnimation = () => {
    if (animationInterval) clearInterval(animationInterval);
    if (!props.tileObject) return;

    if (props.tileObject.frames) {
      animationInterval = setInterval(() => {
        if (!props.tileObject) {
          clearInterval(animationInterval)
          return;
        }
        if (currentFrame.value < props.tileObject.frames - 1) {
          currentFrame.value += 1;
        } else {
          currentFrame.value = 0;
        }
      }, ANIMATION_SPEED);
    } else if (props.tileObject.status) {
      animationInterval = setInterval(() => {
        if (!props.tileObject || !props.tileObject.status) {
          clearInterval(animationInterval)
          return;
        }
        const maxFrames = TILES[props.tile].sprites[props.tileObject.status].length;
        if (currentFrame.value < maxFrames - 1) {
          currentFrame.value += 1;
        } else {
          clearInterval(animationInterval);
        }
      }, ANIMATION_SPEED);
    }
  };

  if (props.tileObject) {
    startAnimation();
  }

  onUnmounted(() => {
    clearInterval(animationInterval);
  });
</script>

<style scoped>
  .tile {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    background-repeat: no-repeat;
  }
  .layer {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    background-repeat: no-repeat;
    position: relative;
  }
</style>