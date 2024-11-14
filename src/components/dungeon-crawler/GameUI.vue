<script setup>
  import dungeonSprite from "../../assets/dungeon-crawler/dungeon-sprite.png";
  import {HEART_SPRITES, ITEM_TYPES} from "./constants.js";

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

  const getHeartSprite = (index) => {
    const currentHealth = props.player.health;
    const heartPosition = index * 2;

    if (currentHealth >= heartPosition + 2) {
      return HEART_SPRITES.FULL;
    } else if (currentHealth > heartPosition) {
      return HEART_SPRITES.HALF;
    } else {
      return HEART_SPRITES.EMPTY;
    }
  };
</script>

<template>
  <div class="game-ui">
    <div class="hearts-container">
      <div
        v-for="i in 3"
        :key="i"
        class="heart"
        :style="{
          backgroundImage: `url(${dungeonSprite})`,
          backgroundPosition: `-${getHeartSprite((i-1)).x}px -${getHeartSprite((i-1)).y}px`,
        }"
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
  position: relative;
  z-index: 105;
  padding: 10px;
  height: 60px;
  background: #000;
}

.hearts-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 0;
  z-index: 10;
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