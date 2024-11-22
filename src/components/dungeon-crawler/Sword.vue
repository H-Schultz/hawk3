<template>
  <div class="sword" :style="getSwordStyle()" />
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
      transform: props.player.direction === 'left' ? 'scaleX(-1)' : 'none',
      transformOrigin: props.player.direction === 'left' ? 'calc(100% - 32px) calc(100% - 16px)' : 'calc(100% - 32px) calc(100% - 16px)',
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
</style>