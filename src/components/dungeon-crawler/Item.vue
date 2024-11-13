<template>
  <div
    :class="['item', getType, { collecting: item.collectAnimation, destroying: item.destroyAnimation }]"
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

  const getType = computed(() => {
    if (props.item.type.includes('POISON')) {
      return 'poison';
    } else if (props.item.config?.destroyable) {
      return 'destroyable';
    }
    return props.item.type.toLowerCase();
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

  .item.poison {
    animation: itemPoison 2s ease-in-out infinite;
  }

  .item.collecting {
    animation: collectItem 0.4s ease-out forwards;
  }

  .item.destroying {
    animation: destroyItem 0.4s ease-out forwards;
  }

  .item.destroyable:not(.collecting, .destroying) {
    animation: none;
  }

  @keyframes itemFloat {
    0%, 100% {
      margin-top: 0;
    }
    50% {
      margin-top: -8px;
    }
  }

  @keyframes itemPoison {
    0%, 100% {
      filter: hue-rotate(0deg);
    }
    50% {
      filter: hue-rotate(180deg);
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

  @keyframes destroyItem {
    0% {
      transform: scale(1);
      opacity: 1;
      z-index: 202;
    }
    70% {
      transform: scale(1) translateY(8px);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.2) translateY(16px);
      filter: saturate(1000%);
      opacity: 0;
    }
  }

</style>