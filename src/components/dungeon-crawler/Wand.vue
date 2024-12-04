<template>
  <div class="wand" :style="getWandStyle()" />
  <div v-if="player.isSpecialAttacking" class="lightning-effects">
    <div class="magic-circle"></div>
    <div class="lightning up"></div>
    <div class="lightning down"></div>
    <div class="lightning left"></div>
    <div class="lightning right"></div>
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
    transformOrigin: 'calc(100% - 32px) calc(100% - 16px)',
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

.player.attacking .wand {
  animation: wandCast 0.4s ease-in-out;
}

.player.charging .wand {
  animation: wandChargeSpecial 1s ease-in-out;
}

.player.specialAttacking .wand {
  animation: wandSpecialCast 1s ease-in-out;
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
  opacity: 0;
}

.lightning.up {
  width: 8px;
  height: 128px;
  top: -40px;
  left: 28px;
  background: linear-gradient(to top, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningUp 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.lightning.down {
  width: 8px;
  height: 128px;
  bottom: -115px;
  left: 28px;
  background: linear-gradient(to bottom, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningDown 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.lightning.left {
  width: 128px;
  height: 8px;
  top: 96px;
  left: -112px;
  background: linear-gradient(to left, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningLeft 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.lightning.right {
  width: 128px;
  height: 8px;
  top: 96px;
  right: -112px;
  background: linear-gradient(to right, rgba(0, 255, 255, 1) 50%, rgba(0, 255, 255, 0.2) 100%);
  animation: lightningRight 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.magic-circle {
  position: absolute;
  width: 8px;
  height: 8px;
  top: 101px;
  left: 32px;
  border: 8px solid rgba(0, 255, 255, 0.9);
  border-radius: 50%;
  pointer-events: none;
  z-index: 204;
  animation: magicCirclePulse 0.8s ease-out;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  opacity: 0;
}

@keyframes magicCirclePulse {
  0% {
    opacity: 0;
    width: 8px;
    height: 8px;
    transform: translate(-4px, -4px);
  }
  50% {
    opacity: 1;
    width: 64px;
    height: 64px;
    transform: translate(-32px, -32px);
  }
  100% {
    opacity: 0;
    width: 8px;
    height: 8px;
    transform: translate(-4px, -4px);
  }
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
    transform: translate(-80px, -60px) rotate(120deg);
  }
}

@keyframes wandSpecialCast {
  0% {
    transform: translate(-80px, -60px) rotate(120deg);
  }
  90% {
    transform: translate(-80px, -60px) rotate(120deg);
  }
  100% {
    transform: translate(-80px, -60px) rotate(120deg);
  }
}

@keyframes lightningUp {
  0% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
  50% {
    opacity: 1;
    transform: rotateY(0deg) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
}

@keyframes lightningDown {
  0% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
  50% {
    opacity: 1;
    transform: rotateY(0deg) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
}

@keyframes lightningLeft {
  0% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
  50% {
    opacity: 1;
    transform: rotateY(0deg) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
}

@keyframes lightningRight {
  0% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
  50% {
    opacity: 1;
    transform: rotateY(0deg) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: rotateY(90deg) scaleY(.2);
  }
}
</style>