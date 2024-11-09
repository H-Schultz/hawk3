<template>
  <div
    :key="enemy.id"
    class="enemy"
    :class="{
      [`enemy--${enemy.direction}-direction`]: true,
      [`enemy--${enemy.type.toLowerCase()}`]: true
    }"
    :style="enemyStyle"
  >
    <div v-if="enemy.health > 0" class="enemy-health">
      <HealthBar :health="enemy.health" :max-health="enemy.maxHealth" />
    </div>
  </div>
</template>

<script setup>
  import {computed, onMounted, ref} from 'vue';
  import HealthBar from './HealthBar.vue';
  import {ANIMATION_SPEED, DISPLAY_SIZE, ENEMY_TYPES} from "./constants.js";
  import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite.png";

  const props = defineProps({
    enemy: {
      type: Object,
      required: true
    },
    activeEnemiesNearPlayer: {
      type: Array,
      required: true
    }
  });

  const currentFrame = ref(0);
  let animationInterval;

  const enemyStyle = computed(() => {
    const enemyType = ENEMY_TYPES[props.enemy.name];
    const sprite = enemyType.sprites[props.enemy.state][currentFrame.value];
    const healthPercentage = props.enemy.health / props.enemy.maxHealth;
    const grayscaleValue = (1 - healthPercentage) * 0.5;

    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
      left: `${props.enemy.position.x * DISPLAY_SIZE}px`,
      top: `${props.enemy.position.y * DISPLAY_SIZE}px`,
      width: `${props.enemy.spriteSize.x}px`,
      height: `${props.enemy.spriteSize.y}px`,
      transform: props.enemy.direction === 'left' ? 'scaleX(-1)' : 'none',
      opacity: props.enemy.health > 0 ? 1 : 0,
      filter: `grayscale(${grayscaleValue})
             ${props.enemy.isUnderAttack ? 'brightness(1.5) sepia(1) saturate(1000%) hue-rotate(0deg)' : ''}
             ${props.enemy.isPreparingAttack ? 'saturate(2) brightness(1.2)' : ''}
             ${props.activeEnemiesNearPlayer.includes(props.enemy) ? 'saturate(1.5)' : ''}`
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
  .enemy {
    position: absolute;
    width: 64px;
    height: 128px;
    image-rendering: pixelated;
    background-repeat: no-repeat;
    transition: left 0.1s ease, top 0.1s ease, filter 0.2s ease;
  }

  .enemy {
    width: 64px;
    height: 96px;
    margin-top: -48px;
    z-index: 102;
  }

  .enemy--boss {
    width: 128px;
    height: 128px;
    margin-top: -74px;
    margin-left: -32px;
  }

  .enemy-health {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 8px;
    background: #444;
    border: 1px solid #000;
    z-index: 104;
  }

  .enemy--left-direction .enemy-health {
    transform: scaleX(-1) translateX(50%);
  }

  .enemy--boss .enemy-health {
    width: 80px;
    height: 12px;
    top: 0;
  }
</style>