<script setup>
import { computed, onMounted, ref, onUnmounted, watch } from 'vue';
import { NPC_SPRITES, DISPLAY_SIZE, ANIMATION_SPEED } from './constants.js';
import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite-v2.png";

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
  shouldReset: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['startQuest', 'showStairs', 'dropGift', 'changeMoving', 'changeCharacter']);

const currentTextIndex = ref(0);
const activeQuestIndex = ref(0);
const showDialog = ref(false);
const hasShownAllText = ref(false);
const selectedCharacterIndex = ref(0);

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

watch(() => props.shouldReset, (shouldReset) => {
  if (shouldReset) {
    activeQuestIndex.value = 0;
    currentTextIndex.value = 0;
    hasShownAllText.value = false;
    showDialog.value = false;
    currentQuest.value.completed = false;
  }
});

// watch quests
watch(() => props.quests, (newQuests) => {
  if (newQuests.length > 0) {
    activeQuestIndex.value = 0;
    currentTextIndex.value = 0;
    hasShownAllText.value = false;
    showDialog.value = false;
  }
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
    emit('showStairs', activeQuestIndex.value);
    emit('dropGift');
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

const checkChangeMoving = () => {
  emit('changeMoving', { quest: currentQuest, stopMoving: showDialog.value && (currentMessage.value === 'chooseCharacter' || currentMessage.value === 'chooseWeapon') });
};

const handleQuestTransition = () => {
  if (currentQuest.value.isReady && isNearPlayer.value) {
    currentQuest.value.completed = true;
    if (activeQuestIndex.value < props.quests.length - 1) {
      activeQuestIndex.value++;
      currentTextIndex.value = 0;
      hasShownAllText.value = false;
    }
  }
};

const weapons = ['SWORD', 'MACE', 'AXE', 'SPEAR'];
const characters = ['DINO', 'KNIGHT', 'HUNTER_MAN', 'HUNTER_WOMAN'];
const changeCharacter = (index) => {
  selectedCharacterIndex.value = index;
  if (currentMessage.value === 'chooseCharacter') {
    emit('changeCharacter', { quest: currentQuest, character: characters[index] });
  } else if (currentMessage.value === 'chooseWeapon') {
    emit('changeCharacter', { quest: currentQuest, weapon: weapons[index] });
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
    transform: currentQuest.value.npc.direction === 'left' ? 'scaleX(-1)' : 'none',
  };
});

const handleKeyPress = (event) => {
  if (event.code === 'Space' && isNearPlayer.value && hasMoreText.value) {
    currentTextIndex.value++;
    checkChangeMoving();
  } else if (showDialog.value && (currentMessage.value === 'chooseCharacter' || currentMessage.value === 'chooseWeapon')) {
    checkChangeMoving();
    const length = currentMessage.value === 'chooseCharacter' ? characters.length : weapons.length;
    if (event.code === 'ArrowUp' || event.key === 'w') {
      selectedCharacterIndex.value = (selectedCharacterIndex.value - 1 + length) % length;
      changeCharacter(selectedCharacterIndex.value);
    } else if (event.code === 'ArrowDown' || event.key === 's') {
      selectedCharacterIndex.value = (selectedCharacterIndex.value + 1) % length;
      changeCharacter(selectedCharacterIndex.value);
    }
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
          top: `${quest.npc.y * DISPLAY_SIZE}px`,
          zIndex: 100 + quest.npc.y
        }"
    >
      <div
        class="npc"
        :style="playerStyle"
      />
      <div v-if="isNearPlayer && showDialog" class="dialog-box">
        <div v-if="currentMessage === 'chooseCharacter'" class="character-selection">
          <div class="character-selection">
            <h3>Wähle deinen Charakter:</h3>
            <ul>
              <li
                v-for="(character, index) in characters"
                :key="character"
                :class="{ selected: index === selectedCharacterIndex }"
              >
                {{ character }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="currentMessage === 'chooseWeapon'" class="character-selection">
          <div class="character-selection">
            <h3>Wähle deine Waffe:</h3>
            <ul>
              <li
                v-for="(weapon, index) in weapons"
                :key="weapon"
                :class="{ selected: index === selectedCharacterIndex }"
              >
                {{ weapon }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p>{{ currentMessage }}</p>
        </div>
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
  z-index: 100;
}

.dialog-box {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 5px;
  width: 340px;
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

.character-selection {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.character-selection li {
  background: #444;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: none;
}

.character-selection li.selected {
  background: #666;
  display: block;
}
</style>