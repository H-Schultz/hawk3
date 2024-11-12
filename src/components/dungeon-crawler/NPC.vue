<script setup>
import {computed, onMounted, ref} from 'vue';
import {NPC_SPRITES, DISPLAY_SIZE, ANIMATION_SPEED} from './constants.js';
import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite.png";

const props = defineProps({
  quest: {
    type: Object,
    required: true
  },
  player: {
    type: Object,
    required: true
  },
  playerState: {
    type: String,
    default: 'idle',
  },
  direction: {
    type: String,
    default: 'left',
  }
});

const emit = defineEmits(['startQuest', 'showStairs']);

const isNearPlayer = computed(() => {
  const dx = Math.abs(props.player.position.x - props.quest.npc.x);
  const dy = Math.abs(props.player.position.y - props.quest.npc.y);
  const near = (dx <= 1 && dy <= 1);
  if (near && !props.quest.started) {
    emit('startQuest', props.quest);
  }
  if (near && props.quest.completed) {
    emit('showStairs', props.quest);
  }

  return near;
});

const currentFrame = ref(0);
let animationInterval;

const playerStyle = computed(() => {
  const sprite = NPC_SPRITES[props.playerState][currentFrame.value];
  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    transform: props.direction === 'left' ? 'scaleX(-1)' : 'none',
  };
});

const startAnimation = () => {
  if (animationInterval) clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % 4;
  }, ANIMATION_SPEED);
};

onMounted(() => {
  startAnimation();
});
</script>

<template>
  <div
    class="npc__wrapper"
    :style="{
      left: `${props.quest.npc.x * DISPLAY_SIZE}px`,
      top: `${props.quest.npc.y * DISPLAY_SIZE}px`
    }"
  >
    <div
      class="npc"
      :style="playerStyle"
    />
    <div v-if="isNearPlayer" class="dialog-box">
      <p v-if="quest.completed">{{ quest.successMessage }}</p>
      <p v-else>{{ quest.description }}</p>
    </div>
  </div>
</template>

<style scoped>
  .npc {
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

  .npc__wrapper {
    position: absolute;
    z-index: 102;
  }

  .dialog-box {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.4);
    color: white;
    padding: 10px;
    border-radius: 5px;
    width: 200px;
    z-index: 100;
    display: flex;
  }
</style>