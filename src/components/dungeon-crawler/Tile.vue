<template>
  <div class="tile" :style="getTileStyle(tile)" />
  <div v-if="props.tileObject?.layer" class="tile tile--layer" :style="getLayerStyle()" />
</template>

<script setup>
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite-v2.png';
  import { TILES, DISPLAY_SIZE, ANIMATION_SPEED } from './constants.js';
  import { ref, onUnmounted, onMounted } from "vue";

  const props = defineProps({
    tile: {
      type: Number,
      required: true
    },
    tileObject: {
      type: Object,
      required: false
    },
    tilePosition: {
      type: Object,
      required: false
    }
  });

  const frameCounter = ref(0);
  let globalAnimationInterval;

  const getTileStyle = (tileType) => {
    const position = TILES[tileType];
    if (!position) return {};

    let sprite = TILES[tileType];
    let frameX = sprite.x;
    let zIndex = 100 + props.tilePosition.y;
    if (position?.zIndex && !props.tileObject?.layer) {
      zIndex += position.zIndex;
    }

    if (props.tileObject?.status) {
      const maxFrames = TILES[tileType].sprites[props.tileObject.status].length;
      const frame = Math.min(frameCounter.value, maxFrames - 1);
      sprite = TILES[tileType].sprites[props.tileObject.status][frame];
      frameX = sprite.x;
    } else if (props.tileObject?.frames) {
      frameX += (frameCounter.value % props.tileObject.frames) * sprite.frameOffset;
    }

    return {
      width: `${DISPLAY_SIZE}px`,
      height: `${DISPLAY_SIZE}px`,
      zIndex: zIndex,
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${frameX * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
    };
  };

  const getLayerStyle = () => {
    const tileType = props.tileObject.layer;
    const position = TILES[tileType];
    if (!position) return {};

    let sprite = TILES[tileType];
    let frameX = sprite.x;
    let zIndex = 100 + props.tilePosition.y;
    if (props.tileObject?.zIndex) {
      zIndex += props.tileObject.zIndex;
    }

    if (props.tileObject?.status) {
      const maxFrames = TILES[tileType].sprites[props.tileObject.status].length;
      const frame = Math.min(frameCounter.value, maxFrames - 1);
      sprite = TILES[tileType].sprites[props.tileObject.status][frame];
      frameX = sprite.x;
    } else if (props.tileObject?.frames) {
      frameX += (frameCounter.value % props.tileObject.frames) * sprite.frameOffset;
    }

    return {
      width: `${DISPLAY_SIZE}px`,
      height: `${DISPLAY_SIZE}px`,
      left: `-${DISPLAY_SIZE}px`,
      marginRight: `-${DISPLAY_SIZE}px`,
      zIndex: zIndex,
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${frameX * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
    };
  };

  onMounted(() => {
    if (props.tileObject && !globalAnimationInterval) {
      globalAnimationInterval = setInterval(() => {
        frameCounter.value++;
      }, ANIMATION_SPEED);
    }
  });

  onUnmounted(() => {
    if (globalAnimationInterval && !document.querySelector('.tile')) {
      clearInterval(globalAnimationInterval);
      globalAnimationInterval = null;
    }
  });
</script>

<style scoped>
  .tile {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    background-repeat: no-repeat;
    position: relative;
  }
</style>