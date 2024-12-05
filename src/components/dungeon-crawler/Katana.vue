<template>
  <div class="kantana" :style="getKantanaStyle()" />
  <div v-if="player.isSpecialAttacking" class="stab-effects">
    <div class="stab top"></div>
    <div class="stab front"></div>
    <div class="stab front2"></div>
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

const getKantanaStyle = () => {
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
.kantana {
  position: absolute;
  width: 64px;
  height: 128px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  right: 0;
  top: 0;
  transition: transform 0.1s ease, opacity 0.1s ease;
  z-index: 200;
  opacity: 0;
  transform: rotate(90deg) translate(-10px, 30px);
}

.player.attacking .kantana {
  animation: kantanaStab 0.4s ease-in-out;
}

.player.charging .kantana {
  animation: kantanaCharge 0.6s ease-in-out;
}

.player.specialAttacking .kantana {
  animation: kantanaCutting 0.6s ease-in-out;
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
  animation: stabEffect 0.3s linear 300ms;
}
.stab.front {
  right: -55px;
  top: 78px;
  animation: stabEffect 0.3s linear;
}
.stab.front2 {
  right: -119px;
  top: 78px;
  animation: stabEffect 0.3s linear 100ms;
}
.stab.bottom {
  left: 8px;
  bottom: -64px;
  animation: stabEffect 0.3s linear 200ms;
}

@keyframes kantanaStab {
  0% {
    opacity: 1;
    transform: rotate(90deg) translate(-10px, 30px);
  }
  10% {
    opacity: 1;
    transform: rotate(90deg) translate(0px, 10px);
  }
  30% {
    transform: rotate(90deg) translate(-10px, 10px);
  }
  39% {
    transform: rotate(90deg) translate(-10px, 10px);
  }
  40% {
    transform: rotate(100deg) translate(-10px, 10px);
  }
  49% {
    transform: rotate(100deg) translate(-10px, 10px);
  }
  50% {
    transform: rotate(80deg) translate(-10px, 10px);
  }
  80% {
    opacity: 1;
    transform: rotate(90deg) translate(-10px, 10px);
  }
  100% {
    opacity: 0;
    transform: rotate(90deg) translate(-10px, 30px);
  }
}

@keyframes kantanaCharge {
  0% {
    opacity: 0;
    transform: rotate(90deg) translate(-10px, 30px);
  }
  10% {
    opacity: 1;
    transform: rotate(60deg) translate(0px, 10px);
  }
  30% {
    transform: rotate(90deg) translate(-10px, 10px);
  }
  100% {
    opacity: 1;
    transform: rotate(90deg) translate(-10px, 30px);
  }
}

@keyframes kantanaCutting {
  0% {
    opacity: 1;
    transform: rotate(90deg) translate(-10px, 30px);
  }
  10% {
    transform: rotate(95deg) translate(-10px, -30px);
  }
  15% {
    transform: rotate(85deg) translate(-10px, -30px);
  }
  20% {
    transform: rotate(90deg) translate(-10px, -30px);
  }
  50% {
    transform: rotate(90deg) translate(-10px, 30px);
  }
  60% {
    transform: rotate(180deg) translate(0px, 30px);
  }
  70% {
    transform: rotate(0deg) translate(0px, 10px);
  }
  95% {
    opacity: 1;
    transform: rotate(0deg) translate(0px, 10px);
  }
  100% {
    opacity: 0;
    transform: rotate(90deg) translate(-10px, 30px);
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