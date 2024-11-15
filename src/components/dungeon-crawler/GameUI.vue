<script setup>
  import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite.png";
  import {ITEM_TYPES} from "./constants.js";
  import LiquidIndicator from "./LiquidIndicator.vue";

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
      <span>{{ props.currentMap?.name }}</span>
      <span v-if="props.currentMap?.type === 'default'">
        Enemies: {{ props.defeatedEnemies }}/{{ props.currentMap?.enemiesRequired }}
      </span>
      <span v-if="props.currentMap?.type === 'boss'">
        Boss Health: {{ props.enemies[0]?.health }}/{{ props.enemies[0]?.maxHealth }}
      </span>
      <span v-if="props.currentMap?.type === 'quest' && props.currentMap?.quest.started">
        Quest Items: {{ props.currentMap?.quest.count }}/{{ props.currentMap?.quest.goal }}
      </span>
    </div>
    <div class="items-container">
      <div class="bomb-icon" :style="{
        backgroundImage: `url(${dungeonSprite})`,
        backgroundPosition: `-${ITEM_TYPES.BOMB.sprite.x * 4}px -${ITEM_TYPES.BOMB.sprite.y * 4}px`,
      }"/>
      <span class="item-count">{{ props.player.bombs }}</span>
      <div class="coin-icon" :style="{
        backgroundImage: `url(${dungeonSprite})`,
        backgroundPosition: `-${ITEM_TYPES.COIN.sprite.x * 4}px -${ITEM_TYPES.COIN.sprite.y * 4}px`,
      }"/>
      <span class="item-count">{{ props.player.coins }}</span>
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
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  display: flex;
  gap: 20px;
  font-size: 18px;
  font-weight: bold;
}

.items-container {
  position: absolute;
  top: 5px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
}

.bomb-icon,
.coin-icon {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-size: 2048px 2048px;
}

.item-count {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.heart {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-size: 2048px 2048px;
}

</style>