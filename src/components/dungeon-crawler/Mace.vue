<template>
  <div class="mace" :style="getMaceStyle()" />
  <div v-if="player.isSpecialAttacking" class="impact-effects">
    <!-- Zentrale Druckwelle -->
    <div class="impact-center"></div>
    <!-- Kleine Druckwellen in direkter Umgebung -->
    <div class="impact-wave wave1"></div>
    <div class="impact-wave wave2"></div>
    <div class="impact-wave wave3"></div>
    <!-- Bodenrisse -->
    <div class="crater"></div>
    <div class="crater-ripple"></div>
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

const getMaceStyle = () => {
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
.mace {
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

.player--choose .mace {
  opacity: 1;
  transform: translate(-50px, 40px) !important;
}

.player.attacking .mace {
  animation: maceSwing 0.5s ease-in-out;
}

.player.charging .mace {
  animation: maceCharge 1s ease-in-out;
}

.player.specialAttacking .mace {
  animation: maceSlam 1s ease-in-out;
}

.impact-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translate(64px, -32px);
}

.impact-center {
  position: absolute;
  width: 64px;
  height: 64px;
  background: rgba(255, 200, 0, 0.8);
  box-shadow: 0 0 20px rgba(255, 200, 0, 0.6);
  border-radius: 50%;
  left: 0;
  bottom: -32px;
  animation: impactCenter 1s ease-out;
}

.impact-wave {
  position: absolute;
  border: 4px solid rgba(255, 200, 0, 0.4);
  border-radius: 50%;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}

.wave1 {
  width: 48px;
  height: 48px;
  animation: impactWave 1s ease-out 0.1s;
}

.wave2 {
  width: 112px;
  height: 112px;
  animation: impactWave 1s ease-out 0.2s;
}

.wave3 {
  width: 164px;
  height: 164px;
  animation: impactWave 1s ease-out 0.3s;
}

.crater {
  position: absolute;
  width: 96px;
  height: 96px;
  background: radial-gradient(circle, rgba(101, 67, 33, 0.6) 0%, transparent 70%);
  left: -16px;
  bottom: -48px;
  animation: craterForm 1s ease-out;
}

.crater-ripple {
  position: absolute;
  width: 128px;
  height: 128px;
  border: 4px solid rgba(101, 67, 33, 0.4);
  border-radius: 50%;
  left: -32px;
  bottom: -64px;
  animation: craterRipple 1s ease-out 0.2s;
}

@keyframes maceSwing {
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

@keyframes maceCharge {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(-8px, -36px) rotate(-8deg);
  }
}

@keyframes maceSlam {
  0% {
    transform: translate(-8px, -36px) rotate(-8deg);
  }
  10% {
    transform: translate(9px, -26px) rotate(102deg);
  }
  20% {
    transform: translate(9px, -32px) rotate(98deg);
  }
  30% {
    transform: translate(9px, -26px) rotate(102deg);
  }
  50% {
    transform: translate(9px, -32px) rotate(98deg);
  }
  100% {
    transform: translate(0, 0) rotate(0);
  }
}

@keyframes impactCenter {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes impactWave {
  0% {
    opacity: 0;
    transform: translate(-50%, 50%) scale(0.1);
  }
  40% {
    opacity: 1;
    transform: translate(-50%, 50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 50%) scale(1.5);
  }
}

@keyframes craterForm {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}

@keyframes craterRipple {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}
</style>