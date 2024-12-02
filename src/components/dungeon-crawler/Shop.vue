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
    type: 'RED_POTION',
    name: 'Health Potion',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.RED_POTION
  }, {
    type: 'BLUE_POTION',
    name: 'Mana Potion',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.BLUE_POTION
  }, {
    type: 'KEY',
    name: 'Key',
    price: 2,
    category: 'consumable',
    config: ITEM_TYPES.KEY
  }, {
    type: 'BOMB',
    name: 'Bomb',
    price: 2,
    category: 'consumable',
    config: ITEM_TYPES.BOMB
  }, {
    type: 'HEART',
    name: 'Heart',
    price: 5,
    category: 'consumable',
    config: ITEM_TYPES.HEART
  }, {
    type: 'MANA',
    name: 'Mana',
    price: 5,
    category: 'consumable',
    config: ITEM_TYPES.MANA
  }, {
    type: 'WAND',
    name: 'Magic Wand',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.WAND
  }, {
    type: 'AXE',
    name: 'Battle Axe',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.AXE
  }, {
    type: 'MACE',
    name: 'Mace',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.MACE
  }, {
    type: 'SWORD',
    name: 'Sword',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.SWORD
  },
]);

const currentSlide = ref(0);
const itemsPerPage = 3;

const totalPages = computed(() => Math.ceil(shopItems.value.length / itemsPerPage));

const visibleItems = computed(() => {
  const start = currentSlide.value * itemsPerPage;
  return shopItems.value.slice(start, start + itemsPerPage);
});

const nextSlide = () => {
  if (currentSlide.value < totalPages.value - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

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
      case 'HEART':
        props.player.maxHealth++;
        props.player.health++;
        break;
      case 'MANA':
        props.player.maxMana++;
        props.player.mana++;
        break;
      case 'KEY':
        props.player.keys++;
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
      <div class="shop-slider">
        <button class="slider-button prev" @click="prevSlide" :disabled="currentSlide === 0">
          ◀
        </button>

        <div class="shop-items">
          <div v-for="item in visibleItems"
               :key="item.type"
               class="shop-item"
               :class="{
                 'shop-item--weapon': item.category === 'weapon',
                 'owned': item.category === 'weapon' && item.config === player.weapon
               }">
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

        <button class="slider-button next" @click="nextSlide" :disabled="currentSlide >= totalPages - 1">
          ▶
        </button>
      </div>

      <button class="continue-button" @click="onClose">Continue</button>
    </div>
  </div>
</template>

<style scoped>
.shop-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 600;
}

.shop-container {
  background: #2a323c;
  border: 4px solid #4a5568;
  border-radius: 4px;
  padding: 4px;
  width: 90%;
  max-width: 600px;
}

.shop-slider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.slider-button {
  background: #4a5568;
  border: none;
  color: white;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.slider-button:hover:not(:disabled) {
  background: #2d3748;
}

.slider-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shop-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 100%;
  overflow: hidden;
}

.shop-item {
  background: #1a202c;
  border: 2px solid #4a5568;
  border-radius: 4px;
  padding: 4px;
  display: grid;
  grid-template-areas:
    'a b'
    'a c';
  gap: 4px;
  transition: transform 0.3s ease;
  height: 140px;
}

.shop-item--weapon .item-sprite {
  height: 128px !important;
}

.shop-item.owned {
  border-color: #48bb78;
}

.item-sprite {
  grid-area: a;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  align-self: center;
}

.item-info {
  grid-area: b;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  color: #fff;
  font-size: 14px;
}

.item-price {
  color: #ffd700;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.buy-button {
  grid-area: c;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  justify-self: stretch;
  align-self: start;
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
  padding: 4px;
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