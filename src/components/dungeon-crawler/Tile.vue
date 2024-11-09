<template>
  <div class="tile" :style="getTileStyle(tile)" />
</template>

<script setup>
import { defineProps } from 'vue';
import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
import { TILES, DISPLAY_SIZE } from './constants.js';

const props = defineProps({
  tile: {
    type: Number,
    required: true
  }
});

const getTileStyle = (tileType) => {
  const position = TILES[tileType];
  if (!position) return {};

  return {
    width: `${DISPLAY_SIZE}px`,
    height: `${DISPLAY_SIZE}px`,
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${position.x * 4}px -${position.y * 4}px`,
    backgroundSize: '2048px 2048px',
  };
};
</script>

<style scoped>
.tile {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
}
</style>