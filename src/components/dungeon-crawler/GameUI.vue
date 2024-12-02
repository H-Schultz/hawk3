<script setup>
import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite-v2.png";
import {ITEM_TYPES} from "./constants.js";
import LiquidIndicator from "./LiquidIndicator.vue";
import {computed, watch} from 'vue';

const props = defineProps({
  player: {
    type: Object,
    required: true
  },
  defeatedEnemies: {
    type: Number,
    required: true
  },
  currentMap: {
    type: Object,
    required: true
  },
  enemies: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['manaRegenerated']);

const handleRegenerated = () => {
  emit('manaRegenerated');
};

const activeQuestIndex = computed(() => {
  if (!props.currentMap?.quests) return -1;
  return props.currentMap.quests.findIndex(quest => !quest.completed);
});

const activeQuest = computed(() => {
  if (activeQuestIndex.value === -1) return null;
  return props.currentMap?.quests?.[activeQuestIndex.value];
});

// Berechne den Quest-Fortschritt
const questProgress = computed(() => {
  if (!props.currentMap?.type === 'quest' || !activeQuest.value?.started) {
    return {
      current: 0,
      max: 0
    };
  }

  let current = activeQuest.value.count || 0;
  let max = activeQuest.value.goal || 0;

  // Füge Feind-Fortschritt hinzu falls vorhanden
  const questEnemies = activeQuest.value.spots.filter(spot => spot.name === 'enemy');
  if (questEnemies.length > 0) {
    const defeatedQuestEnemies = props.enemies
        .filter(enemy => enemy.isQuestEnemy && enemy.health <= 0)
        .length;
    current += defeatedQuestEnemies;
    // max += questEnemies.length;
  }

  return {
    current,
    max
  };
});

const isNearNPC = () => {
  if (!activeQuest.value?.npc) return false;
  const dx = Math.abs(props.player.position.x - activeQuest.value.npc.x);
  const dy = Math.abs(props.player.position.y - activeQuest.value.npc.y);
  return (dx <= 1 && dy <= 1);
};

// Berechne den Quest-Text
const questText = computed(() => {
  if (!activeQuest.value?.started) return '';

  if (activeQuest.value.isReady && !activeQuest.value.completed) {
    return `Quest ${activeQuestIndex.value + 1} abgeschlossen - Sprich mit dem Zauberer!`;
  }

  return `Quest ${activeQuestIndex.value + 1}: ${questProgress.value.current}/${questProgress.value.max}`;
});

// Prüfe ob der Fortschrittsbalken angezeigt werden soll
const showQuestProgress = computed(() => {
  if (!props.currentMap?.type === 'quest' || !activeQuest.value?.started) return false;

  // Verstecke wenn Quest abgeschlossen und Spieler beim NPC
  if (activeQuest.value.isReady && isNearNPC(activeQuest.value)) {
    return false;
  }

  return questProgress.value.max > 0;
});

const progressColors = computed(() => {
  if (activeQuest.value?.isReady) {
    return {
      from: 'rgb(21, 128, 61)',  // Dunkelgrün für fertige Quest
      to: 'rgb(34, 197, 94)'     // Hellgrün für fertige Quest
    };
  }
  return {
    from: 'rgb(147, 51, 234)',   // Standard Lila
    to: 'rgb(168, 85, 247)'
  };
});

const questProgressStyle = computed(() => {
  return {
    opacity: showQuestProgress.value ? 1 : 0,
    transform: showQuestProgress.value ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease'
  };
});
</script>

<template>
  <div class="game-ui">
    <div class="hearts-container">
      <LiquidIndicator
          :current-value="props.player.health"
          :max-value="props.player.maxHealth"
          type="health"
          color-from="rgb(185, 28, 28)"
          color-to="rgb(239, 68, 68)"
          :player="props.player"
          :show-value="true"
      />
      <LiquidIndicator
          :current-value="props.player.mana"
          :max-value="props.player.maxMana"
          type="mana"
          :regeneration-interval="props.player.manaRegeneration"
          color-from="rgb(29, 78, 216)"
          color-to="rgb(59, 130, 246)"
          :player="props.player"
          @regenerated="handleRegenerated"
          :show-value="true"
      />
    </div>
    <div class="level-info">
      <div v-if="props.currentMap?.type === 'combat'" class="quest-progress">
        <LiquidIndicator
            :current-value="props.defeatedEnemies"
            :max-value="props.currentMap?.enemiesRequired"
            type="enemies"
            :color-from="'rgb(22,0,100)'"
            :color-to="'rgb(200,0,130)'"
            :show-value="false"
            :width="200"
          />
        <span class="quest-text">Combat {{ props.defeatedEnemies }}/{{ props.currentMap?.enemiesRequired }}</span>
      </div>
      <div v-else-if="props.currentMap?.type === 'boss'" class="quest-progress">
        <LiquidIndicator
            :current-value="props.enemies[0]?.health"
            :max-value="props.enemies[0]?.maxHealth"
            type="boss"
            :color-from="'rgb(100,40,0)'"
            :color-to="'rgb(200,80,0)'"
            :show-value="false"
            :width="200"
        />
        <span class="quest-text">Boss Health</span>
      </div>
      <div v-else-if="showQuestProgress" class="quest-progress" :style="questProgressStyle">
        <LiquidIndicator
            :current-value="questProgress.current"
            :max-value="questProgress.max"
            type="quest"
            :color-from="progressColors.from"
            :color-to="progressColors.to"
            :show-value="false"
            :width="200"
        />
        <span class="quest-text">{{ questText }}</span>
      </div>
      <div v-else class="level-name">{{ props.currentMap?.name }}</div>
    </div>
    <div class="items-container">
      <div class="bomb-icon" :style="{
        backgroundImage: `url(${dungeonSprite})`,
        backgroundPosition: `-${ITEM_TYPES.BOMB.sprite.x * 4}px -${ITEM_TYPES.BOMB.sprite.y * 4}px`,
      }">
        <span class="item-count">{{ props.player.bombs }}</span>
      </div>
      <div class="key-icon" :style="{
        backgroundImage: `url(${dungeonSprite})`,
        backgroundPosition: `-${ITEM_TYPES.KEY.sprite.x * 4}px -${ITEM_TYPES.KEY.sprite.y * 4}px`,
      }">
        <span class="item-count">{{ props.player.keys }}</span>
      </div>
      <div class="coin-icon" :style="{
        backgroundImage: `url(${dungeonSprite})`,
        backgroundPosition: `-${ITEM_TYPES.COIN_BIG.sprite.x * 4}px -${ITEM_TYPES.COIN_BIG.sprite.y * 4}px`,
      }">
        <span class="item-count">{{ props.player.coins }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-ui {
  position: absolute;
  z-index: 500;
  padding: 10px;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: all;
}

.hearts-container {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
  display: flex;
  gap: 10px;
  width: calc(100% - 20px);
  justify-content: space-between;
}

.level-info {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  display: flex;
  gap: 10px;
  width: calc(100% - 20px);
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  align-items: center;
  color: white;
}

.level-name {
  color: white;
  font-size: 18px;
  font-weight: normal;
  padding: 4px 8px;
}

.quest-text {
  color: white;
  font-size: 18px;
  font-weight: normal;
}

.items-container {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  gap: 0;
  z-index: 4000;
  background-color: rgba(255,255,255,0.3);
  padding: 0;
  border-radius: 15px;
}

.bomb-icon,
.key-icon,
.coin-icon {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-size: 2048px 2048px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.item-count {
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 3px black, 0 -3px 3px black;
}

.quest-progress {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  transition: all 0.3s ease;
}

.quest-progress.completed {
  background: rgba(21, 128, 61, 0.1);
  padding: 5px 10px;
  border-radius: 10px;
}
</style>