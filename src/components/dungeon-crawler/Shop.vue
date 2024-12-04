<script setup>
import { ref, computed, onMounted } from 'vue';
import { WEAPON_CONFIG, ITEM_TYPES, PLAYER_CONFIG } from './constants.js';
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

const currentTab = ref('items'); // 'items', 'weapons' or 'characters'
const itemsPerPage = computed(() => {
  switch (currentTab.value) {
    case 'weapons':
    case 'characters':
      return 3;
    default:
      return 4;
  }
});
const currentSlide = ref(0);
const tabs = ['items', 'weapons', 'characters', 'minigame'];

const characters = ref(Object.entries(PLAYER_CONFIG).map(([key, value]) => ({
  type: key,
  name: value.name,
  config: value,
  price: 15
})));

const weapons = ref([
  {
    type: 'KNIFE',
    name: 'Messer',
    price: 5,
    category: 'weapon',
    config: WEAPON_CONFIG.KNIFE
  }, {
    type: 'AXE',
    name: 'Axt',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.AXE
  }, {
    type: 'SWORD',
    name: 'Schwert',
    price: 10,
    category: 'weapon',
    config: WEAPON_CONFIG.SWORD
  }, {
    type: 'WAND',
    name: 'Zauberstab',
    price: 15,
    category: 'weapon',
    config: WEAPON_CONFIG.WAND
  }, {
    type: 'MACE',
    name: 'Keule',
    price: 15,
    category: 'weapon',
    config: WEAPON_CONFIG.MACE
  }
]);

const items = ref([
  {
    type: 'RED_POTION',
    name: 'Gesundheits Trank',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.RED_POTION
  }, {
    type: 'BLUE_POTION',
    name: 'Ausdauer Trank',
    price: 1,
    category: 'consumable',
    config: ITEM_TYPES.BLUE_POTION
  }, {
    type: 'KEY',
    name: 'Schlüssel',
    price: 2,
    category: 'consumable',
    config: ITEM_TYPES.KEY
  }, {
    type: 'BOMB',
    name: 'Bombe',
    price: 2,
    category: 'consumable',
    config: ITEM_TYPES.BOMB
  }, {
    type: 'HEART',
    name: 'Lebenskraft',
    price: 5,
    category: 'consumable',
    config: ITEM_TYPES.HEART
  }, {
    type: 'MANA',
    name: 'Manakraft',
    price: 5,
    category: 'consumable',
    config: ITEM_TYPES.MANA
  }
]);

const currentItems = computed(() => {
  switch(currentTab.value) {
    case 'items':
      return items.value;
    case 'weapons':
      return weapons.value;
    case 'characters':
      return characters.value;
    default:
      return [];
  }
});

const totalPages = computed(() => Math.ceil(currentItems.value.length / itemsPerPage.value));

const visibleItems = computed(() => {
  const start = currentSlide.value * itemsPerPage.value;
  return currentItems.value.slice(start, start + itemsPerPage.value);
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

const getCharacterStyle = (character) => {
  const sprite = character.config.sprites.idle[0];

  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    width: '64px',
    height: '64px'
  };
};

const changeTab = (tab) => {
  currentTab.value = tab;
  currentSlide.value = 0;
};

const buyItem = (item) => {
  if (props.player.coins < item.price) return;

  props.player.coins -= item.price;

  if (currentTab.value === 'characters') {
    props.player.character = item.config;
    return;
  }

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
  if (currentTab.value === 'characters' && item.config === props.player.character) {
    return false;
  }
  if (item.category === 'weapon' && item.config === props.player.weapon) {
    return false;
  }
  return props.player.coins >= item.price;
};




const isSpinning = ref(false);
const gameMessage = ref('');
const isReturning = ref(false);
const winningIndexes = ref([]);

// Erstelle eine längere Liste von Items für die Animation
const createReelStrip = () => {
  const baseItems = items.value;
  // Wiederhole die Items mehrmals für einen Endlos-Effekt
  return [...baseItems, ...baseItems, ...baseItems];
};

const reels = ref([
  {
    items: createReelStrip(),
    spinning: false,
    offset: 0,
    selectedIndex: 0,
    spinSpeed: 0
  },
  {
    items: createReelStrip(),
    spinning: false,
    offset: 0,
    selectedIndex: 0,
    spinSpeed: 0
  },
  {
    items: createReelStrip(),
    spinning: false,
    offset: 0,
    selectedIndex: 0,
    spinSpeed: 0
  }
]);

const ITEM_HEIGHT = 80; // Höhe jedes Item-Slots
const SPIN_DURATION = 1000;
const MAX_SPEED = 50;

const pullLever = async () => {
  if (isSpinning.value) return;

  isSpinning.value = true;
  isReturning.value = false;
  gameMessage.value = '';
  winningIndexes.value = [];

  // Starte Spin für jede Rolle mit Verzögerung
  for (let i = 0; i < reels.value.length; i++) {
    const reel = reels.value[i];
    reel.spinning = true;
    reel.spinSpeed = MAX_SPEED;

    const targetIndex = Math.floor(Math.random() * items.value.length);
    reel.selectedIndex = targetIndex;

    setTimeout(() => {
      stopReel(i);
    }, SPIN_DURATION + (i * 500));
  }

  // Warte bis alle Rollen gestoppt sind
  setTimeout(() => {
    isReturning.value = true;
    // Warte kurz und setze dann isReturning zurück
    setTimeout(() => {
      checkResults();
      isSpinning.value = false;
      isReturning.value = false;
    }, 1600);
  }, SPIN_DURATION + 1000);
};

const animateReels = () => {
  reels.value.forEach(reel => {
    if (!reel.spinning) return;

    reel.offset += reel.spinSpeed;

    // Reset position when reaching the end
    if (reel.offset >= ITEM_HEIGHT * items.value.length) {
      reel.offset = 0;
    }
  });

  requestAnimationFrame(animateReels);
};

const stopReel = (reelIndex) => {
  const reel = reels.value[reelIndex];

  // Berechne die Endposition basierend auf selectedIndex
  const targetOffset = reel.selectedIndex * ITEM_HEIGHT;

  // Langsam zur Endposition kommen
  const slowDown = () => {
    reel.spinSpeed = Math.max(0, reel.spinSpeed - 2);

    if (reel.spinSpeed <= 0) {
      reel.spinning = false;
      reel.offset = targetOffset;
    }
  };

  const slowDownInterval = setInterval(() => {
    slowDown();
    if (!reel.spinning) {
      clearInterval(slowDownInterval);
    }
  }, 50);
};

const checkResults = () => {
  isSpinning.value = false;
  const results = reels.value.map(reel => items.value[reel.selectedIndex]);

  // Prüfe auf drei gleiche
  if (results[0]?.type === results[1]?.type && results[1]?.type === results[2]?.type) {
    winningIndexes.value = [0, 1, 2];
    gameMessage.value = `Jackpot! 3 ${results[0].name} + 10 Münzen!`;
    props.player.coins += 10;
    giveReward(results[0]);
    giveReward(results[0]);
    giveReward(results[0]);
    return;
  }

  // Prüfe auf zwei gleiche
  for (let i = 0; i < results.length - 1; i++) {
    for (let j = i + 1; j < results.length; j++) {
      if (results[i]?.type === results[j]?.type) {
        winningIndexes.value = [i, j];
        props.player.coins += 1;
        gameMessage.value = `Gewonnen! 1 ${results[i].name} + 1 Münze!`;
        giveReward(results[i]);
        return;
      }
    }
  }

  gameMessage.value = 'Kein Gewinn. Nochmal versuchen!';
};

const giveReward = (item) => {
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

// Start animation loop
onMounted(() => {
  animateReels();
});
</script>

<template>
  <div class="shop-overlay">
    <div class="shop-container">
      <div class="shop-header">
        <div class="tabs">
          <button
              v-for="tab in tabs"
              :key="tab"
              :class="['tab-button', { active: currentTab === tab }]"
              @click="changeTab(tab)"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>
        <div class="coin-display">
          <div class="coin-sprite"></div>
          {{ player.coins }}
        </div>
      </div>

      <div
        class="shop-content"
        v-if="currentTab !== 'minigame'"
      >
        <button class="slider-button prev" @click="prevSlide" :disabled="currentSlide === 0" v-show="totalPages > 1">
          ◀
        </button>

        <div
          class="shop-items"
          :class="{
           'shop-items--weapon': currentTab === 'weapons',
           'shop-items--character': currentTab === 'characters'
          }"
        >
          <div
            v-for="item in visibleItems"
            :key="item.type"
            class="shop-item"
            :class="{
              'shop-item--weapon': currentTab === 'weapons',
              'shop-item--character': currentTab === 'characters',
              'owned': (item.category === 'weapon' && item.config === player.weapon) ||
                (currentTab === 'characters' && item.config === player.character)
            }"
          >
            <div
              class="item-sprite"
              :style="currentTab === 'characters' ? getCharacterStyle(item) : getItemStyle(item)"
            ></div>
            <span class="item-name">{{ item.name }}</span>
            <div class="price-tag">
              <div class="coin-sprite"></div>
              <span class="item-price">{{ item.price }}</span>
            </div>
            <button
              @click="buyItem(item)"
              :disabled="!canBuy(item)"
              :class="['buy-button', { 'disabled': !canBuy(item) }]"
            >
              <template v-if="currentTab === 'characters'">
                {{ item.config === player.character ? 'Ausgewählt' : 'Auswählen' }}
              </template>
              <template v-else-if="currentTab === 'weapons'">
                {{ item.config === player.weapon ? 'Angelegt' : 'Anlegen' }}
              </template>
              <template v-else>
                Kaufen
              </template>
            </button>
          </div>
        </div>

        <button class="slider-button next" @click="nextSlide" :disabled="currentSlide >= totalPages - 1" v-show="totalPages > 1">
          ▶
        </button>
      </div>


      <div v-if="currentTab === 'minigame'" class="minigame-container">
        <div class="slot-machine">
          <div class="reels-container">
            <div
              v-for="(reel, reelIndex) in reels"
              :key="reelIndex"
              class="reel"
              :class="{ 'winner': winningIndexes.includes(reelIndex) }"
            >
              <div
                class="reel-strip"
                :style="{
                  transform: `translateY(-${reel.offset}px)`,
                  transition: reel.spinning ? 'none' : 'transform 0.5s ease-out'
                }"
              >
                <div
                  v-for="(item, itemIndex) in reel.items"
                  :key="`${reelIndex}-${itemIndex}`"
                  class="reel-item"
                >
                  <div class="item-sprite" :style="getItemStyle(item)"></div>
                </div>
              </div>
            </div>
            <div class="slot-controls">
              <div
                class="slot-lever"
                :class="{
                  'pulled': isSpinning,
                  'returning': isReturning
                }"
                @click="pullLever"
                :disabled="isSpinning"
              >
                <div class="lever-base"></div>
                <div class="lever-stick"></div>
                <div class="lever-knob"></div>
              </div>
            </div>
          </div>

          <div class="game-message">{{ gameMessage }}</div>
        </div>
      </div>

      <div class="shop-footer">
        <button class="continue-button" @click="onClose">Nächstes Level</button>
      </div>
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
  background: rgba(0, 0, 0, 0.7);
}

.shop-container {
  background: #2a323c;
  border: 4px solid #4a5568;
  border-radius: 8px;
  padding: 12px;
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.shop-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab-button {
  padding: 6px 12px;
  background: #4a5568;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.tab-button.active {
  background: #4299e1;
}

.coin-display {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #1a202c;
  border-radius: 12px;
  color: #ffd700;
  font-size: 16px;
}

.coin-sprite {
  width: 16px;
  height: 16px;
  background-image: url(../../assets/dungeon-crawler/dungeon-sprite-v2.png);
  background-position: -576px -768px;
  background-size: 1024px 1024px;
  image-rendering: pixelated;
}

.shop-content {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 165px;
}

.shop-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  flex-grow: 1;
}

.shop-items--character,
.shop-items--weapon {
  grid-template-columns: repeat(3, 1fr);
}

.shop-item {
  background: #1a202c;
  border: 2px solid #4a5568;
  border-radius: 4px;
  padding: 4px;
  display: grid;
  grid-template-areas:
    'a a'
    'b b'
    'c d';
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 160px;
}

.shop-item--character,
.shop-item--weapon {
  height: 160px;
  grid-template-areas:
    'a b'
    'a c'
    'a d';
}

.shop-item--character .item-sprite,
.shop-item--weapon .item-sprite {
  height: 128px !important;
}

.shop-item.owned {
  border-color: #48bb78;
  background: #1c2a1c;
}

.shop-item--character .item-sprite {
  transform: scale(1.5);
}

.item-sprite {
  grid-area: a;
  image-rendering: pixelated;
  background-repeat: no-repeat;
}

.item-name {
  grid-area: b;
  color: #fff;
  font-size: 12px;
  display: block;
  margin-bottom: 2px;
}

.price-tag {
  grid-area: c;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.item-price {
  color: #ffd700;
  font-size: 14px;
  font-weight: bold;
}

.slider-button {
  background: #4a5568;
  border: none;
  color: white;
  width: 24px;
  height: 80px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.slider-button:hover:not(:disabled) {
  background: #2d3748;
}

.slider-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.buy-button {
  width: 100%;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  margin-top: auto;
}

.buy-button:hover:not(.disabled) {
  background: #38a169;
}

.buy-button.disabled {
  background: #4a5568;
  cursor: not-allowed;
}

.continue-button {
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
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
    transform: translateY(-2px);
  }
}

.item-sprite {
  animation: itemFloat 2s ease-in-out infinite;
}



.minigame-container {
  min-height: 165px;
}

.slot-machine {
  background: #1a202c;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.slot-controls {
  position: absolute;
  right: -65px;
  top: 55%;
  transform: translate(60%, -80%) rotate(-90deg);
  height: 160px;
  width: 40px;
}

.slot-lever {
  position: relative;
  width: 40px;
  height: 130px;
  cursor: pointer;
  transform-origin: top center;
  transition: transform 0.3s ease-in;
}

.slot-lever:not(:disabled):hover .lever-knob {
  background: #ff3333;
  box-shadow: 0 0 10px #ff3333;
}

.slot-lever.pulled {
  transform: rotate(45deg);
  transition: transform 0.2s ease-in;
}

.slot-lever.returning {
  transform: rotate(0deg);
  transition: transform 0.8s cubic-bezier(0.4, 2.08, 0.55, 0.44);
}

.lever-base {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #4a5568;
  border-radius: 40px;
  box-shadow: inset -2px -2px 4px rgba(0,0,0,0.3);
}

.lever-stick {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 80px;
  background: linear-gradient(90deg, #2d3748, #4a5568);
  border-radius: 4px;
}

.lever-knob {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: #dc2626;
  border-radius: 50%;
  box-shadow:
      inset 2px 2px 4px rgba(255,255,255,0.4),
      inset -2px -2px 4px rgba(0,0,0,0.4),
      0 0 5px rgba(220, 38, 38, 0.5);
  transition: all 0.3s ease;
}

.reels-container {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #2d3748;
  border-radius: 8px;
  border: 2px solid #4a5568;
}

.reel {
  width: 80px;
  height: 80px;
  background: #1a202c;
  border: 2px solid #4a5568;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.reel-strip {
  position: absolute;
  width: 100%;
  will-change: transform;
}

.reel-item {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-sprite {
  image-rendering: pixelated;
  background-repeat: no-repeat;
  transform: scale(0.8);
}

.reel.winner {
  border: 2px solid #48bb78;
  box-shadow: 0 0 10px rgba(72, 187, 120, 0.5);
}

.game-message {
  min-height: 24px;
  text-align: center;
  color: white;
  font-size: 14px;
  margin-top: 10px;
}
</style>