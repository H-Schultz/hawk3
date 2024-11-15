<script setup>
import {computed, onMounted, ref, onUnmounted, watch} from 'vue';
import {NPC_SPRITES, DISPLAY_SIZE, ANIMATION_SPEED} from './constants.js';
import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite.png";

const props = defineProps({
  quests: {
    type: Array,
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

const currentTextIndex = ref(0);
const activeQuestIndex = ref(0);
const showDialog = ref(false);
const hasShownAllText = ref(false);

const currentQuest = computed(() => props.quests[activeQuestIndex.value]);

const isNearPlayer = computed(() => {
  if (!currentQuest.value?.npc) return false;

  const dx = Math.abs(props.player.position.x - currentQuest.value.npc.x);
  const dy = Math.abs(props.player.position.y - currentQuest.value.npc.y);
  const near = (dx <= 1 && dy <= 1);

  if (near && !showDialog.value) {
    showDialog.value = true;
  } else if (!near) {
    showDialog.value = false;
    if (!currentQuest.value.started) {
      currentTextIndex.value = 0;
      hasShownAllText.value = false;
    }
  }

  return near;
});

watch(() => currentTextIndex.value, (newValue) => {
  if (Array.isArray(currentQuest.value?.description) &&
      newValue === currentQuest.value.description.length - 1) {
    hasShownAllText.value = true;
  }
});

const shouldStartQuest = computed(() => {
  return isNearPlayer.value &&
      hasShownAllText.value &&
      !currentQuest.value.started &&
      !currentQuest.value.completed;
});

watch(shouldStartQuest, (shouldStart) => {
  if (shouldStart) {
    emit('startQuest', currentQuest.value);
  }
});

watch(() => currentQuest.value?.completed, (isCompleted) => {
  if (isCompleted) {
    emit('showStairs', currentQuest.value);
    if (activeQuestIndex.value < props.quests.length - 1) {
      activeQuestIndex.value++;
      currentTextIndex.value = 0;
      hasShownAllText.value = false;
    }
  }
});

watch(isNearPlayer, (near) => {
  if (near && currentQuest.value?.isReady) {
    handleQuestTransition();
  }
});

const handleQuestTransition = () => {
  if (currentQuest.value.isReady && isNearPlayer.value) {
    currentQuest.value.completed = true;

    // Warte kurz bevor die nächste Quest startet
    setTimeout(() => {
      if (activeQuestIndex.value < props.quests.length - 1) {
        activeQuestIndex.value++;
        currentTextIndex.value = 0;
        hasShownAllText.value = false;
      }
    }, 500);
  }
};

const currentMessage = computed(() => {
  if (!currentQuest.value) return '';

  if (currentQuest.value.completed) {
    return currentQuest.value.successMessage;
  }

  if (Array.isArray(currentQuest.value.description)) {
    return currentQuest.value.description[currentTextIndex.value];
  }

  return currentQuest.value.description;
});

const hasMoreText = computed(() => {
  return Array.isArray(currentQuest.value?.description) &&
      currentTextIndex.value < currentQuest.value.description.length - 1;
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

const handleKeyPress = (event) => {
  if (event.code === 'Space' && isNearPlayer.value && hasMoreText.value) {
    currentTextIndex.value++;
  }
};

const startAnimation = () => {
  if (animationInterval) clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % 4;
  }, ANIMATION_SPEED);
};

onMounted(() => {
  startAnimation();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval);
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <template v-for="(quest, index) in quests" :key="index">
    <div
        v-if="index === activeQuestIndex"
        class="npc__wrapper"
        :style="{
        left: `${quest.npc.x * DISPLAY_SIZE}px`,
        top: `${quest.npc.y * DISPLAY_SIZE}px`
      }"
    >
      <div
          class="npc"
          :style="playerStyle"
      />
      <div v-if="isNearPlayer && showDialog" class="dialog-box">
        <p>{{ currentMessage }}</p>
        <span v-if="hasMoreText" class="continue-hint">
          [Leertaste] für weiter...
        </span>
        <span v-else-if="!currentQuest.started && !currentQuest.completed" class="continue-hint">
          Gehe nah heran um die Quest zu starten...
        </span>
      </div>
    </div>
  </template>
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
  z-index: 100;
  transform-origin: center;
}

.npc__wrapper {
  position: absolute;
  z-index: 200;
}

.dialog-box {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 5px;
  width: 300px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.continue-hint {
  font-size: 0.8em;
  color: #aaa;
  text-align: right;
}
</style>