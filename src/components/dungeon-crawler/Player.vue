<template>
  <div
    class="player"
    :class="{
      'attacking': player.isAttacking,
      'charging': player.isCharging,
      'whirlwindAttacking': player.isWhirlwindAttacking,
    }"
    :style="playerStyle"
  >
    <Sword :player="player" />
  </div>
</template>

<script setup>
  import {computed, onMounted, ref} from 'vue';
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
  import {DISPLAY_SIZE, ANIMATION_SPEED} from './constants.js';
  import Sword from './Sword.vue';

  const props = defineProps({
    player: {
      type: Object,
      required: true
    }
  });

  const currentFrame = ref(0);
  let animationInterval;

  const playerStyle = computed(() => {
    const sprite = props.player.character.sprites[props.player.state][currentFrame.value];
    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
      left: `${props.player.position.x * DISPLAY_SIZE}px`,
      top: `${props.player.position.y * DISPLAY_SIZE}px`,
      transform: props.player.direction === 'left' ? 'scaleX(-1)' : 'none',
      filter: props.player.isUnderAttack ? 'brightness(1.5) sepia(1) saturate(1000%) hue-rotate(0deg)' : 'none',
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