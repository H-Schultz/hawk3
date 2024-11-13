<template>
  <div
      v-if="isVisible"
      :class="`explosion-effect explosion-${bombId}`"
      :style="{
        left: `${position.x * DISPLAY_SIZE}px`,
        top: `${position.y * DISPLAY_SIZE}px`
      }"
  ></div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import {DISPLAY_SIZE} from "./constants.js";

  const props = defineProps({
    position: {
      type: Object,
      required: true
    },
    bombId: {
      type: String,
      required: true
    }
  });

  const isVisible = ref(true);

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = false;
    }, 500); // Animation dauert 500ms
  });
</script>

<style scoped>
  .explosion-effect {
    position: absolute;
    width: 64px;
    height: 64px;
    background: radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(255,165,0,0.3) 100%);
    pointer-events: none;
    z-index: 100;
    animation: explode 500ms ease-out forwards;
  }

  @keyframes explode {
    0% {
      transform: scale(0.5);
      filter: brightness(2);
      opacity: 1;
      z-index: 205;
    }
    70% {
      filter: brightness(1.5);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      filter: brightness(1);
      opacity: 0;
    }
  }
</style>