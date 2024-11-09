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
    transform: scale(1.5);
    opacity: 0;
  }

  @keyframes itemFloat {
    0%, 100% {
      margin-top: 0;
    }
    50% {
      margin-top: -8px;
    }
  }

  @keyframes collectHeart {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 0.5;
    }
    100% {
      transform: scale(2) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes collectCoin {
    0% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
    50% {
      transform: scale(1.2) translateY(-20px);
      opacity: 0.7;
    }
    100% {
      transform: scale(1.5) translateY(-40px);
      opacity: 0;
    }
  }

  .item.heart.collecting,
  .item.blue_potion.collecting {
    animation: collectHeart 0.3s ease-out forwards;
  }

  .item.coin.collecting {
    animation: collectCoin 0.4s ease-out forwards;
  }
</style>