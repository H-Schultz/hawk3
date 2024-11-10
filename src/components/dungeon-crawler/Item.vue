<template>
  <div
    :class="['item', item.type.toLowerCase(), { collecting: item.collectAnimation }]"
    :style="itemStyle"
  />
</template>

<script setup>
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
  import { ITEM_TYPES, DISPLAY_SIZE } from './constants.js';

  const props = defineProps({
    item: Object
  });

  const currentFrame = ref(0);
  let animationInterval;

  onMounted(() => {
    if (ITEM_TYPES[props.item.type].frames > 1) {
      animationInterval = setInterval(() => {
        currentFrame.value = (currentFrame.value + 1) % ITEM_TYPES[props.item.type].frames;
      }, 150);
    }
  });

  onUnmounted(() => {
    if (animationInterval) {
      clearInterval(animationInterval);
    }
  });

  const itemStyle = computed(() => {
    const itemType = ITEM_TYPES[props.item.type];
    const sprite = itemType.sprite;
    let frameX = sprite.x;

    if (itemType.frames > 1) {
      frameX += currentFrame.value * itemType.frameOffset;
    }

    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${frameX * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
      left: `${props.item.position.x * DISPLAY_SIZE + (DISPLAY_SIZE - itemType.size.width * 4) / 2}px`,
      top: `${props.item.position.y * DISPLAY_SIZE + (DISPLAY_SIZE - itemType.size.height * 4) / 2}px`,
      width: `${itemType.size.width * 4}px`,
      height: `${itemType.size.height * 4}px`,
    };
  });
</script>

<style scoped>
  .item {
    position: absolute;
    image-rendering: pixelated;
    background-repeat: no-repeat;
    transition: margin-top 0.2s ease;
    z-index: 101;
    animation: itemFloat 2s ease-in-out infinite;
  }

  .item.collecting {
    animation: collectItem 0.4s ease-out forwards;
  }

  @keyframes itemFloat {
    0%, 100% {
      margin-top: 0;
    }
    50% {
      margin-top: -8px;
    }
  }

  @keyframes collectItem {
    0% {
      transform: scale(1);
      opacity: 1;
      z-index: 202;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

</style>