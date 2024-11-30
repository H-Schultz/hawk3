<template>
  <div class="axe" :style="getAxeStyle()" />
  <div v-if="player.isSpecialAttacking" class="strike-effects">
    <div class="strike forward-1"></div>
    <div class="strike forward-2"></div>
    <div class="strike diagonal-left"></div>
    <div class="strike diagonal-right"></div>
    <div class="strike up"></div>
    <div class="strike down"></div>
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

const getAxeStyle = () => {
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
.axe {
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

.player--choose .axe {
  opacity: 1;
  transform: translate(-50px, 40px) !important;
}

.player.attacking .axe {
  animation: axeSwing 0.4s ease-in-out;
}

.player.charging .axe {
  animation: axeCharge 1s ease-in-out;
}

.player.specialAttacking .axe {
  animation: axeDoubleSwing 1s ease-in-out;
}

.strike-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translate(0px, 5px);
}

.strike {
  position: absolute;
  background: rgba(255, 0, 0, 0.4);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  width: 64px;
  height: 64px;
  pointer-events: none;
}

.strike.forward-1 { top: 64px; right: -64px; }
.strike.forward-2 { top: 64px; right: -128px; }
.strike.diagonal-left { right: -64px; top: 0; }
.strike.diagonal-right { right: -64px; top: 128px; }
.strike.up { top: 0; }
.strike.down { bottom: -64px; }
.strike.forward-1 { animation: strikeFirst 0.4s ease-out; }
.strike.forward-2 { animation: strikeFirst 0.4s ease-out 0.1s; }
.strike.diagonal-left { animation: strikeSecond 0.4s ease-out 0.4s; }
.strike.diagonal-right { animation: strikeSecond 0.4s ease-out 0.4s; }
.strike.up { animation: strikeSecond 0.4s ease-out 0.4s; }
.strike.down { animation: strikeSecond 0.4s ease-out 0.4s; }

@keyframes axeSwing {
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

@keyframes axeCharge {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: translate(-20px, -10px) rotate(-40deg);
  }
}

@keyframes axeDoubleSwing {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  10% {
    transform: translate(30px, -10px) rotate(90deg);
  }
  100% {
    transform: translate(0, -10px) rotate(90deg);
  }
}

@keyframes strikeFirst {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes strikeSecond {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>