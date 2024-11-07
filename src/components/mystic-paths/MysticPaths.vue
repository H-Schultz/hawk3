<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router';

const PLAYER_SPEED = 4;
const SPRITE_SIZE = 32;
const COLLISION_OFFSET = 12;
const INTERACTION_DISTANCE = 40;
const router = useRouter();

function goBack() {
  router.push('/');
}

const quests = [
  {
    id: 1,
    description: 'Sammle 3 Kräuter in der Nähe der Bäume!',
    goal: 3,
    type: 'herb',
    completed: false,
    button: 'Kräuter sammeln',
    success: 'Fantastisch! Du hast alle Kräuter gefunden!',
    spots: [
      {x: 2, y: 0, collected: false, type: 'herb'},
      {x: 11, y: 1, collected: false, type: 'herb'},
      {x: 16, y: 1, collected: false, type: 'herb'},
      {x: 1, y: 5, collected: false, type: 'herb'},
      {x: 7, y: 7, collected: false, type: 'herb'}]
  }, {
    id: 2,
    description: 'Sammle noch 7 blaue Beeren!',
    goal: 7,
    type: 'berry',
    completed: false,
    button: 'Beeren sammeln',
    success: 'Danke, mehr kannst du nicht tun. Nimm den gelben Schlüssel als Dank.',
    gift: 'yellowKey',
    spots: [
      {x: 7, y: 1, collected: false, type: 'berry'},
      {x: 15, y: 2, collected: false, type: 'berry'},
      {x: 6, y: 9, collected: false, type: 'berry'},
      {x: 3, y: 8, collected: false, type: 'berry'},
      {x: 12, y: 5, collected: false, type: 'berry'},
      {x: 7, y: 5, collected: false, type: 'berry'},
      {x: 2, y: 6, collected: false, type: 'berry'},
      {x: 9, y: 7, collected: false, type: 'berry'},
      {x: 12, y: 10, collected: false, type: 'berry'},
      {x: 4, y: 13, collected: false, type: 'berry'}]
  }
];
const activeQuestIndex = ref(0);
const currentQuest = computed(() => quests[activeQuestIndex.value]);
const hasActiveQuest = ref(false);
const showDialog = ref(true);
const herbsCollected = ref(0);
const questCompleted = ref(false);

const npcPosition = {
  x: 4,
  y: 3
};

const outsideMap = {
  width: 20,
  height: 15,
  spawnPoint: {x: 10, y: 11},
  exits: [
    {x: 4, y: 4, target: 'house1', useTargetSpawnPoint: true},
    {x: 10, y: 4, target: 'house2', useTargetSpawnPoint: true}
  ],
  tiles: [
    // 0: Gras, 1: Weg, 2: Mauer, 3: Baum, 4: Wasser, 5: Haustür, 6: Schatz
    [0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 3, 0, 4, 0, 0, 3, 0, 0, 0],
    [0, 3, 2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0],
    [0, 0, 2, 1, 1, 1, 2, 0, 1, 2, 2, 2, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 1, 1, 1, 2, 0, 1, 2, 1, 2, 0, 4, 3, 0, 0, 3, 0, 0],
    [0, 0, 2, 2, 5, 2, 2, 0, 1, 2, 5, 2, 0, 4, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 3, 0, 0, 0, 3, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 4, 4, 0, 0, 0, 0, 0],
    [0, 3, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 2, 2, 2, 2, 0, 3, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3],
    [0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2, 2, 2, 2, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 3, 0, 0, 1, 1, 1, 0, 0, 4, 3, 0, 0, 3, 0],
    [3, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 1, 1, 0, 3, 4, 4, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 3],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 4, 0, 0, 0]
  ]
};

const houses = {
  house1: {
    width: 9,
    height: 8,
    spawnPoint: {x: 4, y: 6},
    exits: [
      {x: 4, y: 7, target: 'outside', spawnPoint: {x: 4, y: 5}}
    ],
    tiles: [
      [2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 2, 2, 2, 5, 2, 2, 2, 2]
    ]
  },
  house2: {
    width: 5,
    height: 6,
    spawnPoint: {x: 2, y: 4},
    exits: [
      {x: 2, y: 5, target: 'outside', spawnPoint: {x: 10, y: 5}}
    ],
    tiles: [
      [2, 2, 2, 2, 2],
      [2, 1, 1, 6, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 1, 1, 1, 2],
      [2, 2, 5, 2, 2]
    ]
  }
};

const currentLocation = ref('outside');
const maps = {
  outside: outsideMap,
  ...houses
};
const playerPosition = ref({
  x: maps.outside.spawnPoint.x * SPRITE_SIZE,
  y: maps.outside.spawnPoint.y * SPRITE_SIZE
});
const playerDirection = ref('down');
const playerFrame = ref(0);
const isMoving = ref(false);
const isTransitioning = ref(false);
const animationFrameId = ref(null);
const pressedKeys = ref(new Set());
const currentMap = computed(() => maps[currentLocation.value]);
const showChestHint = ref(false);
const playerInventory = ref({
  yellowKey: false,
  saber: false
});
const isNearNPC = computed(() => {
  if (currentLocation.value !== 'house1') return false;

  const distance = Math.sqrt(
      Math.pow((playerPosition.value.x / SPRITE_SIZE) - npcPosition.x, 2) +
      Math.pow((playerPosition.value.y / SPRITE_SIZE) - npcPosition.y, 2)
  );

  return distance < 2;
});

const nearbyHerb = computed(() => {
  if (currentLocation.value !== 'outside' || !hasActiveQuest.value) return null;

  const playerTileX = Math.floor(playerPosition.value.x / SPRITE_SIZE);
  const playerTileY = Math.floor(playerPosition.value.y / SPRITE_SIZE);

  return currentQuest.value.spots.find(herb => {
    return !herb.collected &&
        Math.abs(herb.x - playerTileX) <= 1 &&
        Math.abs(herb.y - playerTileY) <= 1;
  });
});

const nearbyChest = computed(() => {
  if (currentLocation.value !== 'house2') return null;

  const playerTileX = Math.floor(playerPosition.value.x / SPRITE_SIZE);
  const playerTileY = Math.floor(playerPosition.value.y / SPRITE_SIZE);

  const chestX = 3;
  const chestY = 1;

  return Math.abs(chestX - playerTileX) <= 1 &&
      Math.abs(chestY - playerTileY) <= 1;
});

const mapStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${currentMap.value.width}, ${SPRITE_SIZE}px)`,
  gap: '0px',
  position: 'relative',
}));

const playerStyle = computed(() => ({
  position: 'absolute',
  left: `${playerPosition.value.x}px`,
  top: `${playerPosition.value.y}px`,
  width: `${SPRITE_SIZE}px`,
  height: `${SPRITE_SIZE}px`,
  transition: isTransitioning.value ? 'opacity 0.5s' : 'transform 0.1s',
  backgroundColor: '#ff0000',
  zIndex: 1000,
  opacity: isTransitioning.value ? 0 : 1,
}));

const handleInteraction = () => {
  if (isNearNPC.value) {
    if (!hasActiveQuest.value && !currentQuest.value.completed) {
      showDialog.value = true;
      acceptQuest();
    } else if (questCompleted.value) {
      showDialog.value = true;
      finishQuest();
    }
  } else if (nearbyHerb.value && !questCompleted.value) {
    collectHerb(nearbyHerb.value);
  } else if (nearbyChest.value) {
    if (!playerInventory.value.yellowKey) {
      showChestHint.value = true;
      setTimeout(() => {
        showChestHint.value = false;
      }, 2000);
    } else {
      playerInventory.value.saber = true;
    }
  }
};

const collectHerb = (herb) => {
  herb.collected = true;
  herbsCollected.value++;

  if (herbsCollected.value >= currentQuest.value.goal) {
    questCompleted.value = true;
    showDialog.value = true;
  }
};

const acceptQuest = () => {
  hasActiveQuest.value = true;
  showDialog.value = false;
};

const finishQuest = () => {
  currentQuest.value.completed = true;
  herbsCollected.value = 0;
  hasActiveQuest.value = false;

  if (currentQuest.value.gift) {
    playerInventory.value[currentQuest.value.gift] = true;
  }
  if (activeQuestIndex.value < quests.length - 1) {
    questCompleted.value = false;
    activeQuestIndex.value = activeQuestIndex.value + 1;
  }
};

const checkCollision = (newX, newY) => {
  const collisionBox = {
    x: newX + COLLISION_OFFSET,
    y: newY + COLLISION_OFFSET,
    width: SPRITE_SIZE - (COLLISION_OFFSET * 2),
    height: SPRITE_SIZE - (COLLISION_OFFSET * 2)
  };

  const leftTile = Math.floor(collisionBox.x / SPRITE_SIZE);
  const rightTile = Math.floor((collisionBox.x + collisionBox.width) / SPRITE_SIZE);
  const topTile = Math.floor(collisionBox.y / SPRITE_SIZE);
  const bottomTile = Math.floor((collisionBox.y + collisionBox.height) / SPRITE_SIZE);

  if (leftTile < 0 || rightTile >= currentMap.value.width ||
      topTile < 0 || bottomTile >= currentMap.value.height) {
    return true;
  }

  for (let y = topTile; y <= bottomTile; y++) {
    for (let x = leftTile; x <= rightTile; x++) {
      const tile = currentMap.value.tiles[y][x];
      if ([2, 3, 4, 6].includes(tile)) { // Wände, Bäume und Wasser sind nicht passierbar
        return true;
      }
    }
  }

  return false;
};

const handleLocationTransition = async (exit) => {
  if (isTransitioning.value) return;

  isTransitioning.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));

  const targetMap = maps[exit.target];
  currentLocation.value = exit.target;

  // Use spawn point from exit definition or map default
  const spawnPoint = exit.spawnPoint || targetMap.spawnPoint;
  playerPosition.value = {
    x: spawnPoint.x * SPRITE_SIZE,
    y: spawnPoint.y * SPRITE_SIZE
  };

  await new Promise(resolve => setTimeout(resolve, 100));
  isTransitioning.value = false;
};

const checkExits = () => {
  const playerTileX = Math.floor((playerPosition.value.x + SPRITE_SIZE / 2) / SPRITE_SIZE);
  const playerTileY = Math.floor((playerPosition.value.y + SPRITE_SIZE / 2) / SPRITE_SIZE);

  const currentExits = currentMap.value.exits;
  const matchingExit = currentExits?.find(exit =>
      exit.x === playerTileX && exit.y === playerTileY
  );

  if (matchingExit) {
    handleLocationTransition(matchingExit);
  }
};

const updatePlayerPosition = () => {
  let moveX = 0;
  let moveY = 0;
  isMoving.value = false;

  if (pressedKeys.value.has('ArrowUp') || pressedKeys.value.has('w')) {
    moveY = -PLAYER_SPEED;
    playerDirection.value = 'up';
    isMoving.value = true;
  }
  if (pressedKeys.value.has('ArrowDown') || pressedKeys.value.has('s')) {
    moveY = PLAYER_SPEED;
    playerDirection.value = 'down';
    isMoving.value = true;
  }
  if (pressedKeys.value.has('ArrowLeft') || pressedKeys.value.has('a')) {
    moveX = -PLAYER_SPEED;
    playerDirection.value = 'left';
    isMoving.value = true;
  }
  if (pressedKeys.value.has('ArrowRight') || pressedKeys.value.has('d')) {
    moveX = PLAYER_SPEED;
    playerDirection.value = 'right';
    isMoving.value = true;
  }

  if (moveX !== 0 && moveY !== 0) {
    moveX *= 0.707;
    moveY *= 0.707;
  }

  const newX = playerPosition.value.x + moveX;
  const newY = playerPosition.value.y + moveY;

  let canMoveX = !checkCollision(newX, playerPosition.value.y);
  let canMoveY = !checkCollision(playerPosition.value.x, newY);

  if (canMoveX) {
    playerPosition.value.x = newX;
  }
  if (canMoveY) {
    playerPosition.value.y = newY;
  }

  if (isMoving.value) {
    playerFrame.value = (playerFrame.value + 1) % 4;
  } else {
    playerFrame.value = 0;
  }

  checkExits();
};

const gameLoop = () => {
  updatePlayerPosition();
  animationFrameId.value = requestAnimationFrame(gameLoop);
};

const handleKeyDown = (e) => {
  pressedKeys.value.add(e.key);
  if (e.key === 'Enter' || e.key === 'e') {
    handleInteraction();
  }
  e.preventDefault();
};

const handleKeyUp = (e) => {
  pressedKeys.value.delete(e.key);
};

const getTileClass = (tileType) => {
  const tileClasses = {
    0: 'tile-grass',
    1: 'tile-path',
    2: 'tile-wall',
    3: 'tile-tree',
    4: 'tile-water',
    5: 'tile-door',
    6: 'tile-chest',
  };
  return ['tile', tileClasses[tileType]];
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  gameLoop();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});
</script>

<template>
  <div class="min-h-screen">
    <header class="header">
      <button class="back-button" @click="goBack">Back</button>
    </header>
    <main class="main-content">
      <div class="game-container">
        <div class="game-map" :style="mapStyle">
          <template v-for="(row, y) in currentMap.tiles" :key="y">
            <div
                v-for="(tile, x) in row"
                :key="`${x}-${y}`"
                :class="getTileClass(tile)"
                :data-x="x"
                :data-y="y"
            ></div>
          </template>

          <div
              v-if="currentLocation === 'outside' && hasActiveQuest"
              v-for="herb in currentQuest.spots"
              :key="`herb-${herb.x}-${herb.y}`"
              :class="[herb.type, { 'herb-collected': herb.collected }]"
              :style="{
              position: 'absolute',
              left: `${herb.x * SPRITE_SIZE}px`,
              top: `${herb.y * SPRITE_SIZE}px`,
            }"
          ></div>

          <!-- NPC -->
          <div
              v-if="currentLocation === 'house1'"
              class="npc"
              :style="{
              position: 'absolute',
              left: `${npcPosition.x * SPRITE_SIZE}px`,
              top: `${npcPosition.y * SPRITE_SIZE}px`,
            }"
          >
            <div v-if="isNearNPC && showDialog" class="speech-bubble">
              <template v-if="!hasActiveQuest && !currentQuest.completed">
                <p>{{ currentQuest.description }}</p>
                <button @click="acceptQuest" class="accept-button">{{ currentQuest.button }}</button>
              </template>
              <template v-else-if="questCompleted">
                <p>{{ currentQuest.success }}</p>
              </template>
            </div>
          </div>

          <div
              v-if="nearbyHerb"
              class="herb-hint"
          >
            Drücke E zum Sammeln
          </div>
          <div
              v-if="nearbyChest && !playerInventory.yellowKey"
              class="chest-hint"
          >
            Du brauchst einen gelben Schlüssel
          </div>
          <div
              v-if="nearbyChest && playerInventory.saber"
              class="chest-hint"
          >
            Du hast ein Schwert bekommen
          </div>
          <!-- Player -->
          <div
              class="player"
              :style="playerStyle"
              :class="[
              `player-${playerDirection}`,
              { 'player-moving': isMoving },
              `player-frame-${playerFrame}`
            ]"
          ></div>
        </div>

        <!-- Quest Status -->
        <div v-if="hasActiveQuest" class="quest-status">
          {{ currentQuest.type }}: {{ herbsCollected }}/{{ currentQuest.goal }}
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #000;
  min-height: 100vh;
  position: relative;
}

.herb, .berry {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: translate(8px, 8px);
  z-index: 800;
  animation: herb-float 1s infinite ease-in-out;
}

.herb {
  background-color: #32CD32;
}

.berry {
  background-color: #1E90FF;
}

.herb-collected {
  opacity: 0;
  transition: opacity 0.3s;
}

.herb-hint,
.chest-hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -120px);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 1200;
}

.npc {
  width: 32px;
  height: 32px;
  background-color: #4169E1;
  border-radius: 50%;
  z-index: 900;
}

.speech-bubble {
  position: absolute;
  background: white;
  border-radius: 8px;
  padding: 10px;
  width: 200px;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

p {
  margin: 0;
}

.accept-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.accept-button:hover {
  background-color: #45a049;
}

.quest-status {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
}

@keyframes herb-float {
  0%, 100% {
    transform: translate(8px, 8px);
  }
  50% {
    transform: translate(8px, 4px);
  }
}

.game-map {
  background-color: #87ceeb;
  transition: opacity 0.5s;
}

.tile {
  width: 32px;
  height: 32px;
  transition: all 0.2s;
}

.tile-grass {
  background-color: #90EE90;
}

.tile-path {
  background-color: #DEB887;
}

.tile-wall {
  background-color: #808080;
}

.tile-tree {
  background-color: #90EE90;
  position: relative;
}

.tile-tree::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #228B22;
}

.tile-water {
  background-color: #4169E1;
  animation: water-animation 2s infinite;
}

.tile-chest {
  background-color: #B18E61;
  position: relative;
  box-shadow: 0 0 0 3px #111 inset;
  border-radius: 10px 10px 0 0;
}

.tile-chest::after {
  content: '';
  position: absolute;
  top: 30%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: #FFD700;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.tile-door {
  background-color: #8B4513;
  position: relative;
}

.tile-door::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: #FFD700;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.player {
  border-radius: 50%;
  transition: transform 0.1s;
}

.player-up {
  transform: rotate(0deg);
}

.player-right {
  transform: rotate(90deg);
}

.player-down {
  transform: rotate(180deg);
}

.player-left {
  transform: rotate(270deg);
}

.player-moving {
  animation: player-bob 0.4s infinite;
}

@keyframes water-animation {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

@keyframes player-bob {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>