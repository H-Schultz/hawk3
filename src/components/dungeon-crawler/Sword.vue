<template>
  <div class="sword" :style="getSwordStyle()" />
</template>

<script setup>
  import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';
  import {SWORD_SPRITE} from './constants.js';

  const props = defineProps({
    playerDirection: {
      type: String,
      required: true
    }
  });

  const getSwordStyle = () => {
    return {
      backgroundImage: `url(${dungeonSprite})`,
      backgroundPosition: `-${SWORD_SPRITE.x * 4}px -${SWORD_SPRITE.y * 4}px`,
      backgroundSize: '2048px 2048px',
      transform: props.playerDirection === 'left' ? 'scaleX(-1)' : 'none',
      transformOrigin: props.playerDirection === 'left' ? 'calc(100% - 32px) calc(100% - 16px)' : 'calc(100% - 32px) calc(100% - 16px)',
    };
  };
</script>

<style scoped>

.sword {
  position: absolute;
  width: 64px;
  height: 128px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  right: 0;
  top: 0;
  transition: transform 0.1s ease, opacity 0.1s ease;
  opacity: 0;
}

.player.attacking .sword {
  animation: swordSwing 0.4s ease-in-out;
}

.player.charging .sword {
  animation: swordChargeWhirlwind 2s ease-in-out;
}

.player.chargingWhirlwind .sword {
  animation: swordChargeWhirlwind 2s ease-in-out;
}

.player.whirlwindAttacking .sword {
  animation: swordWhirlwind 0.8s linear;
}

@keyframes swordChargeWhirlwind {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: translateY(-32px) rotate(-10deg);
  }
}

@keyframes swordWhirlwind {
  0% {
    opacity: 1;
    transform: translateY(-32px) rotate(-10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(720deg);
  }
}

@keyframes swordSwing {
  10% {
    opacity: 1;
    transform: rotate(-10deg);
  }
  30% {
    transform: rotate(90deg);
  }
  70% {
    opacity: 1;
    transform: rotate(10deg);
  }
  100% {
    opacity: 0;
  }
}
</style>