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
  import { ref, computed } from 'vue';
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
  import { PLAYER_SPRITES, DISPLAY_SIZE, WHIRLWIND_DURATION, CHARGE_TIME } from './constants.js';
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
    isUnderAttack: {
      type: Boolean,
      default: false
    },
    gameState: {
      type: String,
      required: true
    }
  });

  const emit = defineEmits([
    'attack',
    'whirlwind-attack',
    'move',
    'health-changed'
  ]);

  // Player state refs
  const direction = ref('right');
  const playerState = ref('idle');
  const currentFrame = ref(0);
  const isAttacking = ref(false);
  const isWhirlwindAttacking = ref(false);
  const chargeStartTime = ref(null);
  const isCharging = ref(false);
  const hasExecutedWhirlwind = ref(false);
  let chargeTimer = null;

  // Computed styles
  const playerStyle = computed(() => {
    const sprite = PLAYER_SPRITES[playerState.value][currentFrame.value];
    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
      backgroundSize: '2048px 2048px',
      left: `${props.position.x * DISPLAY_SIZE}px`,
      top: `${props.position.y * DISPLAY_SIZE}px`,
      transform: direction.value === 'left' ? 'scaleX(-1)' : 'none',
      filter: props.isUnderAttack ? 'brightness(1.5) sepia(1) saturate(1000%) hue-rotate(0deg)' : 'none',
      animation: isAttacking.value ? 'swordSwing 0.4s ease-in-out' : 'none'
    };
  });

  // Movement methods
  const move = (dx, dy) => {
    if (props.gameState !== 'PLAYING') return;

    if (dx !== 0) {
      direction.value = dx > 0 ? 'right' : 'left';
    }

    playerState.value = 'run';
    emit('move', { dx, dy });
  };

  // Attack methods
  const startCharging = () => {
    if (isCharging.value || isAttacking.value || isWhirlwindAttacking.value || props.gameState !== 'PLAYING') return;

    if (!hasExecutedWhirlwind.value) {
      chargeStartTime.value = Date.now();
      isCharging.value = true;

      chargeTimer = setTimeout(() => {
        if (isCharging.value) {
          executeWhirlwindAttack();
          isCharging.value = false;
          chargeStartTime.value = null;
          hasExecutedWhirlwind.value = true;
        }
      }, CHARGE_TIME);
    }
  };

  const executeAttack = () => {
    if (!isCharging.value || props.gameState !== 'PLAYING') return;

    if (chargeTimer) {
      clearTimeout(chargeTimer);
      chargeTimer = null;
    }

    const chargeTime = Date.now() - chargeStartTime.value;
    isCharging.value = false;
    chargeStartTime.value = null;

    if (chargeTime < CHARGE_TIME && !hasExecutedWhirlwind.value) {
      attackWithSword();
    }
  };

  const attackWithSword = () => {
    if (isAttacking.value || props.gameState !== 'PLAYING') return;

    isAttacking.value = true;
    emit('attack', { direction: direction.value });

    setTimeout(() => {
      isAttacking.value = false;
    }, 400);
  };

  const executeWhirlwindAttack = () => {
    isWhirlwindAttacking.value = true;
    emit('whirlwind-attack');

    setTimeout(() => {
      isWhirlwindAttacking.value = false;
    }, WHIRLWIND_DURATION);
  };

  // Key handlers
  const handleKeydown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        move(0, -1);
        break;
      case 'ArrowDown':
      case 's':
        move(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
        move(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
        move(1, 0);
        break;
      case 'e':
        startCharging();
        break;
    }
  };

  const handleKeyup = (e) => {
    if (e.key === 'e') {
      executeAttack();
      hasExecutedWhirlwind.value = false;
    }
    playerState.value = 'idle';
  };

  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
  });

  onUnmounted(() => {
    if (chargeTimer) clearTimeout(chargeTimer);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('keyup', handleKeyup);
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

  @keyframes swordSwing {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(30deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>