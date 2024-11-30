<template>
  <div class="wand" :style="getWandStyle()">
    <div v-if="player.isSpecialAttacking" class="lightning-effects">
      <div class="lightning up"></div>
      <div class="lightning down"></div>
      <div class="lightning left"></div>
      <div class="lightning right"></div>
    </div>
  </div>
</template>

<script setup>
import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite-v2.png';

const props = defineProps({
  player: {
    type: Object,
    required: true
  }
});

const getWandStyle = () => {
  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${props.player.weapon.sprite.x * 4}px -${props.player.weapon.sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    transform: props.player.direction === 'left' ? 'scaleX(-1)' : 'none',
    transformOrigin: props.player.direction === 'left' ? 'calc(100% - 32px) calc(100% - 16px)' : 'calc(100% - 32px) calc(100% - 16px)',
    opacity: props.player.isAttacking || props.player.isCharging || props.player.isSpecialAttacking || props.player.gameState === 'CHOOSE' ? 1 : 0
  };
};
</script>

<style scoped>
.wand {
  position: absolute;
  width: 64px;
  height: 128px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  right: 0;
  top: 0;
  transition: transform 0.1s ease;
  z-index: 200;
}

.player--choose .wand {
  transform: translate(-50px, 40px) !important;
}

.player.attacking .wand {
  animation: wandCast 0.4s ease-in-out;
}

.player.charging .wand {
  animation: wandChargeSpecial 1s ease-in-out;
}

.player.specialAttacking .wand {
  animation: wandSpecialCast 0.8s ease-in-out;
}

.lightning-effects {
  position: absolute;
  width: 100%;
  height: 100%;
}

.lightning {
  position: absolute;
  pointer-events: none;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  z-index: 205;
}

.lightning.up {
  width: 8px;
  height: 128px;
  top: -128px;
  left: 28px;
  background: linear-gradient(to top, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningUp 0.4s ease-out;
}

.lightning.down {
  width: 8px;
  height: 128px;
  bottom: -48px;
  left: 28px;
  background: linear-gradient(to bottom, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningDown 0.4s ease-out;
}

.lightning.left {
  width: 128px;
  height: 8px;
  top: 28px;
  left: -112px;
  background: linear-gradient(to left, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningLeft 0.4s ease-out;
}

.lightning.right {
  width: 128px;
  height: 8px;
  top: 28px;
  right: -112px;
  background: linear-gradient(to right, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningRight 0.4s ease-out;
}

@keyframes wandCast {
  0% {
    opacity: 1;
    transform: rotate(0deg);
  }
  10% {
    opacity: 1;
    transform: rotate(-10deg);
  }
  30% {
    transform: rotate(50deg);
  }
  80% {
    opacity: 1;
    transform: rotate(10deg);
  }
  100% {
    opacity: 0;
  }
}

@keyframes wandChargeSpecial {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(-80px, -10px) rotate(90deg);
  }
}

@keyframes wandSpecialCast {
  0% {
    transform: translate(-80px, -10px) rotate(90deg);;
  }
  90% {
    transform: translate(-80px, -10px) rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes lightningUp {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  20% {
    opacity: 1;
    transform: scaleY(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes lightningDown {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  20% {
    opacity: 1;
    transform: scaleY(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes lightningLeft {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  20% {
    opacity: 1;
    transform: scaleX(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes lightningRight {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  20% {
    opacity: 1;
    transform: scaleX(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>