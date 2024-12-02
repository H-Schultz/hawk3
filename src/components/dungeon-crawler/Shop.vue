<script setup>
import { ref, computed } from 'vue';
import { WEAPON_CONFIG, ITEM_TYPES, DISPLAY_SIZE } from './constants.js';
import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite-v2.png';

const props = defineProps({
  player: {
    type: Object,
    required: true
  },
  onClose: {
    type: Function,
    required: true
  }
});

const shopItems = ref([
  {
    type: 'WAND',
    name: 'Magic Wand',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.WAND
  },
  {
    type: 'AXE',
    name: 'Battle Axe',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.AXE
  },
  {
    type: 'MACE',
    name: 'Mace',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.MACE
  },
  {
    type: 'RED_POTION',
    name: 'Health Potion',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.RED_POTION
  },
  {
    type: 'BLUE_POTION',
    name: 'Mana Potion',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.BLUE_POTION
  },
  {
    type: 'BOMB',
    name: 'Bomb',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.BOMB
  }
]);

const getItemStyle = (item) => {
  const sprite = item.config.sprite;

  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    width: `${(sprite.width || 16) * 4}px`,
    height: `${(sprite.height || 16) * 4}px`
  };
};

const buyItem = (item) => {
  if (props.player.coins < item.price) return;

  props.player.coins -= item.price;

  if (item.category === 'weapon') {
    props.player.weapon = item.config;
  } else if (item.category === 'consumable') {
    switch (item.type) {
      case 'BOMB':
        props.player.bombs++;
        break;
      case 'RED_POTION':
        props.player.health = Math.min(props.player.maxHealth, props.player.health + 1);
        break;
      case 'BLUE_POTION':
        props.player.mana = Math.min(props.player.maxMana, props.player.mana + 1);
        break;
    }
  }
};

const canBuy = (item) => {
  if (item.category === 'weapon' && item.config === props.player.weapon) {
    return false;
  }
  return props.player.coins >= item.price;
};
</script>

<template>
  <div class="shop-overlay">
    <div class="shop-container">
      <div class="shop-header">
        <h2>Shop</h2>
        <div class="coin-counter">
          <div class="coin-sprite"></div>
          {{ player.coins }}
        </div>
      </div>

      <div class="shop-items">
        <div v-for="item in shopItems"
             :key="item.type"
             class="shop-item"
             :class="{ 'owned': item.category === 'weapon' && item.config === player.weapon }">
          <div class="item-sprite" :style="getItemStyle(item)"></div>
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">{{ item.price }}</span>
          </div>
          <button
              @click="buyItem(item)"
              :disabled="!canBuy(item)"
              :class="['buy-button', { 'disabled': !canBuy(item) }]"
          >
            {{ item.category === 'weapon' && item.config === player.weapon ? 'Owned' : 'Buy' }}
          </button>
        </div>
      </div>

      <button class="continue-button" @click="onClose">Continue</button>
    </div>
  </div>
</template>

<style scoped>
.shop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shop-container {
  background: #2a323c;
  border: 4px solid #4a5568;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #4a5568;
}

.shop-header h2 {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.coin-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffd700;
  font-size: 20px;
}

.coin-sprite {
  width: 32px;
  height: 32px;
  background-image: url(../../assets/dungeon-crawler/dungeon-sprite-v2.png);
  background-position: -128px -64px;
  background-size: 2048px 2048px;
  image-rendering: pixelated;
}

.shop-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.shop-item {
  background: #1a202c;
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.shop-item.owned {
  border-color: #48bb78;
}

.item-sprite {
  image-rendering: pixelated;
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  color: #fff;
  font-size: 16px;
}

.item-price {
  color: #ffd700;
  font-size: 14px;
}

.buy-button {
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.buy-button:hover:not(.disabled) {
  background: #38a169;
}

.buy-button.disabled {
  background: #4a5568;
  cursor: not-allowed;
}

.continue-button {
  display: block;
  width: 100%;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.continue-button:hover {
  background: #3182ce;
}

@keyframes itemFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.item-sprite {
  animation: itemFloat 2s ease-in-out infinite;
}
</style>