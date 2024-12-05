<template>
  <div class="knife" :style="getKnifeStyle()" />
  <div v-if="player.isSpecialAttacking" class="stab-effects">
    <div class="stab top"></div>
    <div class="stab front"></div>
    <div class="stab bottom"></div>
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

const getKnifeStyle = () => {
  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${props.player.weapon.sprite.x * 4}px -${props.player.weapon.sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    transformOrigin: 'calc(100% - 24px) calc(100% + 8px)',
    opacity: props.player.isAttacking || props.player.isCharging || props.player.isSpecialAttacking || props.player.gameState === 'CHOOSE' ? 1 : 0
  };
};
</script>

<style scoped>
.knife {
  position: absolute;
  width: 64px;
  height: 96px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  right: 0;
  top: 0;
  transition: transform 0.1s ease, opacity 0.1s ease;
  opacity: 0;
  z-index: 200;
}

.player.attacking .knife {
  animation: knifeStab 0.4s ease-in-out;
}

.player.charging .knife {
  animation: knifeCharge 0.6s ease-in-out;
}

.player.specialAttacking .knife {
  animation: knifeCutting 1s ease-in-out;
}

.stab-effects {
  position: absolute;
  width: 100%;
  height: 100%;
}

.stab {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  width: 48px;
  height: 48px;
  pointer-events: none;
  opacity: 0;
  border-radius: 20%;
}

.stab.top {
  left: 8px;
  top: 16px;
  animation: stabEffect 0.3s linear;
}
.stab.front {
  right: -55px;
  top: 78px;
  animation: stabEffect 0.3s linear 100ms;
}
.stab.bottom {
  left: 8px;
  bottom: -64px;
  animation: stabEffect 0.3s linear 200ms;
}

@keyframes knifeStab {
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

@keyframes knifeCharge {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: rotate(-16deg);
  }
}

@keyframes knifeCutting {
  0% {
    transform: rotate(-16deg);
  }
  10% {
    transform: rotate(180deg);
  }
  20% {
    transform: rotate(45deg);
  }
  30% {
    transform: rotate(145deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(0);
  }
}

@keyframes stabEffect {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  30% {
    opacity: 1;
    transform: scale(1.1);
  }
  70% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}
</style>