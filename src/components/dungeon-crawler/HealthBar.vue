<template>
  <div class="health-bar" :style="{ width: `${(props.health / props.maxHealth) * 100}%` }" />
</template>

<script setup>
  const props = defineProps({
    health: {
      type: Number,
      required: true
    },
    maxHealth: {
      type: Number,
      required: true
    }
  });
</script>

<style scoped>
  .health-bar {
    height: 100%;
    background: rgba(255, 0, 0, 0.8);
    transition: width 0.3s ease;
  }
</style>