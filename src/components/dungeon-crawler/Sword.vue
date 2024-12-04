<template>
  <div class="sword" :style="getSwordStyle()" />
  <div v-if="player.isSpecialAttacking" class="whirl-effects">
    <div class="whirl top-left"></div>
    <div class="whirl top"></div>
    <div class="whirl top-right"></div>
    <div class="whirl left"></div>
    <div class="whirl right"></div>
    <div class="whirl bottom-left"></div>
    <div class="whirl bottom"></div>
    <div class="whirl bottom-right"></div>
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

const getSwordStyle = () => {
  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${props.player.weapon.sprite.x * 4}px -${props.player.weapon.sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    transformOrigin: 'calc(100% - 32px) calc(100% - 16px)',
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
  z-index: 200;
}

.player.attacking .sword {
  animation: swordSwing 0.4s ease-in-out;
}

.player.charging .sword {
  animation: swordChargeSpecial 2s ease-in-out;
}

.player.specialAttacking .sword {
  animation: swordSpecial 0.8s linear;
}

.whirl-effects {
  position: absolute;
  width: 100%;
  height: 100%;
}

.whirl {
  position: absolute;
  background: rgba(255, 255, 190, 0.4);
  box-shadow: 0 0 15px rgba(255, 255, 190, 0.2);
  width: 64px;
  height: 64px;
  pointer-events: none;
  opacity: 0;
  border-radius: 40%;
}

.whirl.top { left: 0; top: 0; animation: whirlEffect 0.8s linear; }
.whirl.top-right { right: -64px; top: 0; animation: whirlEffect 0.8s linear 100ms; }
.whirl.right { right: -64px; top: 64px; animation: whirlEffect 0.8s linear 200ms; }
.whirl.bottom-right { right: -64px; bottom: -64px; animation: whirlEffect 0.8s linear 300ms; }
.whirl.bottom { left: 0; bottom: -64px; animation: whirlEffect 0.8s linear 400ms; }
.whirl.bottom-left { left: -64px; bottom: -64px; animation: whirlEffect 0.8s linear 500ms; }
.whirl.left { left: -64px; top: 64px; animation: whirlEffect 0.8s linear 600ms; }
.whirl.top-left { left: -64px; top: 0; animation: whirlEffect 0.8s linear 700ms; }

@keyframes swordChargeSpecial {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(-32px) rotate(-10deg);
  }
}

@keyframes swordSpecial {
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
  0% {
    opacity: 1;
    transform: rotate(0deg);
  }
  10% {
    opacity: 1;
    transform: rotate(-30deg);
  }
  30% {
    transform: rotate(90deg);
  }
  80% {
    opacity: 1;
    transform: rotate(10deg);
  }
  100% {
    opacity: 0;
  }
}

@keyframes whirlEffect {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(0deg);
  }
  20% {
    opacity: 1;
    transform: scale(1.1) rotate(90deg);
  }
  40% {
    transform: scale(1) rotate(180deg);
  }
  60% {
    transform: scale(1.1) rotate(270deg);
  }
  80% {
    opacity: 1;
    transform: scale(1) rotate(360deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) rotate(360deg);
  }
}
</style>