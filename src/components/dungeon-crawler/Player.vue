<template>
  <div
    class="player"
    :class="{
      'attacking': player.isAttacking,
      'charging': player.isCharging,
      'specialAttacking': player.isSpecialAttacking,
      'player--left': player.direction === 'left',
      'player--right': player.direction === 'right',
    }"
    :style="playerStyle"
  >
    <template v-if="player.weapon.name === 'knife'">
      <Knife :player="player" />
    </template>
    <template v-else-if="player.weapon.name === 'wand'">
      <Wand :player="player" />
    </template>
    <template v-else-if="player.weapon.name === 'axe'">
      <Axe :player="player" />
    </template>
    <template v-else-if="player.weapon.name === 'mace'">
      <Mace :player="player" />
    </template>
    <template v-else>
      <Sword :player="player" />
    </template>
  </div>
</template>

<script setup>
  import {computed, onMounted, ref} from 'vue';
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite-v2.png';
  import {DISPLAY_SIZE, ANIMATION_SPEED, GAME_STATE} from './constants.js';
  import Knife from './Knife.vue';
  import Sword from './Sword.vue';
  import Wand from './Wand.vue';
  import Axe from './Axe.vue';
  import Mace from "./Mace.vue";

  const props = defineProps({
    player: {
      type: Object,
      required: true
    },
    gameState: {
      type: String,
      required: true
    }
  });

  const currentFrame = ref(0);
  let animationInterval;

  const playerStyle = computed(() => {
    const sprite = props.player.character.sprites[props.player.state][currentFrame.value];
    const zIndex = (props.player.isSpecialAttacking) ? 102 + props.player.position.y : 100 + props.player.position.y + 1;
    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
      left: `${props.player.position.x * DISPLAY_SIZE}px`,
      top: `${props.player.position.y * DISPLAY_SIZE}px`,
      zIndex: zIndex,
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
    z-index: 100;
    transform-origin: center;
  }
</style>