<template>
  <div
    class="player"
    :class="{
      'attacking': isAttacking,
      'charging': isCharging,
      'whirlwindAttacking': isWhirlwindAttacking,
    }"
    :style="playerStyle"
  >
    <Sword :player-direction="direction" />
  </div>
</template>

<script setup>
  import {computed, onMounted, ref} from 'vue';
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
  import {PLAYER_SPRITES, DISPLAY_SIZE, ANIMATION_SPEED} from './constants.js';
  import Sword from './Sword.vue';

  const props = defineProps({
    position: {
      type: Object,
      required: true
    },
    health: {
      type: Number,
      required: true
    },
    isAttacking: {
      type: Boolean,
      required: true
    },
    isCharging: {
      type: Boolean,
      required: true
    },
    isWhirlwindAttacking: {
      type: Boolean,
      required: true
    },
    isUnderAttack: {
      type: Boolean,
      default: false
    },
    gameState: {
      type: String,
      required: true
    },
    playerState: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      required: true
    },
  });

  const currentFrame = ref(0);
  let animationInterval;

  const playerStyle = computed(() => {
    const sprite = PLAYER_SPRITES[props.playerState][currentFrame.value];
    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
      left: `${props.position.x * DISPLAY_SIZE}px`,
      top: `${props.position.y * DISPLAY_SIZE}px`,
      transform: props.direction === 'left' ? 'scaleX(-1)' : 'none',
      filter: props.isUnderAttack ? 'brightness(1.5) sepia(1) saturate(1000%) hue-rotate(0deg)' : 'none',
    };
  });

  const startAnimation = () => {
    if (animationInterval) clearInterval(animationInterval);

    animationInterval = setInterval(() => {
      currentFrame.value = (currentFrame.value + 1) % 4;
    }, ANIMATION_SPEED);
  };

  onMounted(() => {
    startAnimation();
  });
</script>

<style scoped>
  .player {
    position: absolute;
    width: 64px;
    height: 128px;
    image-rendering: pixelated;
    background-repeat: no-repeat;
    transition: left 0.1s ease, top 0.1s ease, filter 0.2s ease;
    margin-top: -72px;
    z-index: 103;
    transform-origin: center;
  }
</style>