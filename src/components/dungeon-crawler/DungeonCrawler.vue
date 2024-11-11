<script setup>
import {ref, onMounted, onUnmounted, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {
  GAME_STATE, MAPS, ANIMATION_SPEED,
  MAX_HEALTH, LEVEL_CONFIG, WHIRLWIND_DURATION, CHARGE_TIME,
  SPAWN_CONFIG, ENEMY_CONFIG, ENEMY_TYPES, TILES,
} from './constants.js';
import Player from './Player.vue';
import Enemy from './Enemy.vue';
import Item from './Item.vue';
import GameUI from './GameUI.vue';
import Overlay from './Overlay.vue';
import Tile from './Tile.vue';
import NPC from './NPC.vue';


const playerHealth = ref(MAX_HEALTH);
const isWhirlwindAttacking = ref(false);
const chargeStartTime = ref(null);
const isCharging = ref(false);
const hasExecutedWhirlwind = ref(false);
let chargeTimer = null;

const playerPosition = ref({x: 1, y: 1});
const playerDirection = ref('right');
const playerState = ref('idle');
const currentFrame = ref(0);
const isAttacking = ref(false);
const isUnderAttack = ref(false);
const enemyFrame = ref(0);
const droppedItems = ref([]);
const coins = ref(0);
const gameState = ref(GAME_STATE.PLAYING);
const defeatedEnemies = ref(0);
const currentMapIndex = ref(0);
const currentMap = ref([]);
const isStairActive = ref(false);
const dungeonMap = ref(null);
const router = useRouter();
const activeQuest = ref(null);
const questItems = ref([]);
const traps = ref([]);

function goBack() {
  router.push('/');
}

let nextEnemyId = 1;

const enemies = ref([
  {
    id: nextEnemyId++,
    type: 'default',
    name: 'SKELETON',
    position: {x: 5, y: 2},
    direction: 'left',
    state: 'idle',
    frame: 0,
    health: ENEMY_TYPES.SKELETON.maxHealth,
    maxHealth: ENEMY_TYPES.SKELETON.maxHealth,
    spriteSize: ENEMY_TYPES.SKELETON.spriteSize,
    canAttack: true,
    isPreparingAttack: false,
    isUnderAttack: false,
    moveInterval: null
  }
]);

let animationInterval;
let attackCheckInterval;

const isSamePosition = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

const activeEnemiesNearPlayer = computed(() => {
  return enemies.value.filter(enemy => {
    if (enemy.health <= 0) return false;

    const dx = Math.abs(playerPosition.value.x - enemy.position.x);
    const dy = Math.abs(playerPosition.value.y - enemy.position.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  });
});

const loadMap = (mapIndex) => {
  const mapData = MAPS[mapIndex];
  if (!mapData) return false;

  const layout = mapData.layout;
  let startPos = {x: 1, y: 1};

  isStairActive.value = false;
  const processedLayout = layout.map(row =>
      row.map(tile => tile === 90 || (tile === 98 && !isStairActive.value) ? 20 : tile)
  );

  currentMapIndex.value = mapIndex;
  currentMap.value = mapData;
  dungeonMap.value = processedLayout;
  traps.value = [];

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === 90) {
        startPos = {x, y};
      }
      if (layout[y][x] === 30) {
        initializeTrap(x, y);
      }
    }
  }

  playerPosition.value = startPos;
  console.log('Loaded map:', playerPosition.value);
  defeatedEnemies.value = 0;
  enemies.value = [];
  droppedItems.value = [];

  if (mapData.type === 'quest') {
    activeQuest.value = mapData.quest;
    activeQuest.value.started = false;
    activeQuest.value.completed = false;
    activeQuest.value.count = 0;
  }

  if (mapData.type === 'boss' && mapData.bossConfig) {
    const bossConfig = mapData.bossConfig;
    const bossType = ENEMY_TYPES[bossConfig.name];

    const boss = {
      id: nextEnemyId++,
      type: bossConfig.type,
      name: bossConfig.name,
      position: {...bossConfig.position},
      direction: 'left',
      state: 'idle',
      frame: 0,
      health: bossType.maxHealth,
      maxHealth: bossType.maxHealth,
      spriteSize: bossType.spriteSize,
      canAttack: true,
      isPreparingAttack: false,
      isUnderAttack: false,
      moveInterval: null
    };

    enemies.value = [boss];
    startEnemyMovement(boss);
  } else {
    if (spawnInterval) clearTimeout(spawnInterval);
    startSpawnSystem();
  }

  return true;
};

const startQuest = (quest) => {
  if (quest.completed || quest.started) return;
  activeQuest.value = quest;
  activeQuest.value.started = true;
  activeQuest.value.count = 0;
  activeQuest.value.completed = false;
  questItems.value = quest.spots.map(spot => ({
    ...spot,
    collected: false
  }));
};

const dropItem = (position) => {
  const dropChance = Math.random();
  if (dropChance > 0.99) return; // 30% Chance für einen Drop

  const itemTypes = currentMap.value.allowedItems || [];
  if (itemTypes.length === 0) return;
  const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  droppedItems.value.push({
    id: Math.random().toString(36).substr(2, 9),
    type: randomItem,
    position: {...position},
    collectAnimation: false
  });
};

// Funktion zum Einsammeln von Items
const collectItem = (item) => {
  item.collectAnimation = true;
  setTimeout(() => {
    if (item.type === 'COIN') {
      coins.value++;
    } else if (item.type === 'HEART') {
      playerHealth.value = Math.min(MAX_HEALTH, playerHealth.value + 2);
    }
    droppedItems.value = droppedItems.value.filter(i => i.id !== item.id);
  }, 200);
};

const isValidMove = (position) => {
  const {x, y} = position;

  if (!dungeonMap.value[y] ||
      dungeonMap.value[y][x] === undefined ||
      dungeonMap.value[y][x] === 10 ||
      dungeonMap.value[y][x] === 99) {
    return false;
  }

  // Prüfe Kollision mit allen Feinden
  if (enemies.value.some(enemy =>
      enemy.health > 0 &&
      enemy.position.x === position.x &&
      enemy.position.y === position.y
  )) {
    return false;
  }

  return true;
};

// Funktion zum Überprüfen der Angriffsrichtung
const getAttackPosition = () => {
  const position = {...playerPosition.value};

  switch (playerDirection.value) {
    case 'right':
      position.x += 1;
      break;
    case 'left':
      position.x -= 1;
      break;
  }

  return position;
};

// Funktion für den Schwertangriff
const attackWithSword = () => {
  if (isAttacking.value || gameState.value !== GAME_STATE.PLAYING) return;

  isAttacking.value = true;
  const attackPos = getAttackPosition();

  enemies.value.forEach(enemy => {
    if (enemy.health > 0 &&
        enemy.position.x === attackPos.x &&
        enemy.position.y === attackPos.y) {
      enemy.health--;

      if (enemy.health <= 0) {
        defeatedEnemies.value++;
        dropItem(enemy.position);

        // Prüfe ob genug Feinde besiegt wurden
        if (defeatedEnemies.value >= currentMap.value.enemiesRequired) {
          showStairs();
        }
      } else {
        enemy.isUnderAttack = true;
        setTimeout(() => {
          enemy.isUnderAttack = false;
        }, 200);
      }
    }
  });

  setTimeout(() => {
    isAttacking.value = false;
  }, 400);
};

const executeWhirlwindAttack = () => {
  isWhirlwindAttacking.value = true;

  const surroundingPositions = [
    {x: -1, y: 0}, // Links
    {x: 1, y: 0},  // Rechts
    {x: 0, y: -1}, // Oben
    {x: 0, y: 1},  // Unten
    {x: -1, y: -1}, // Diagonal oben links
    {x: 1, y: -1},  // Diagonal oben rechts
    {x: -1, y: 1},  // Diagonal unten links
    {x: 1, y: 1}    // Diagonal unten rechts
  ];

  // Erster Treffer nach 200ms (1/4 Rotation)
  setTimeout(() => {
    applyWhirlwindDamage(surroundingPositions);
  }, 200);

  // Zweiter Treffer nach 400ms (1/2 Rotation)
  setTimeout(() => {
    applyWhirlwindDamage(surroundingPositions);
  }, 400);

  // Dritter Treffer nach 600ms (3/4 Rotation)
  setTimeout(() => {
    applyWhirlwindDamage(surroundingPositions);
  }, 600);

  // Letzter Treffer nach 800ms (volle Rotation)
  setTimeout(() => {
    applyWhirlwindDamage(surroundingPositions);
    isWhirlwindAttacking.value = false;
  }, WHIRLWIND_DURATION);
};

const applyWhirlwindDamage = (surroundingPositions) => {
  enemies.value.forEach(enemy => {
    if (enemy.health > 0) {
      const isInRange = surroundingPositions.some(pos =>
          enemy.position.x === playerPosition.value.x + pos.x &&
          enemy.position.y === playerPosition.value.y + pos.y
      );

      if (isInRange) {
        enemy.health -= 1;
        enemy.isUnderAttack = true;

        if (enemy.health <= 0) {
          defeatedEnemies.value++;
          dropItem(enemy.position);

          if (defeatedEnemies.value >= currentMap.value.enemiesRequired) {
            showStairs();
          }
        }

        setTimeout(() => {
          enemy.isUnderAttack = false;
        }, 200);
      }
    }
  });
};

const updateBossAttackPattern = (boss) => {
  if (!boss.specialAttackTimer) {
    boss.specialAttackTimer = 0;
  }
  boss.specialAttackTimer++;

  if (boss.specialAttackTimer >= 50) {
    boss.specialAttackTimer = 0;

    const dx = playerPosition.value.x - boss.position.x;
    const dy = playerPosition.value.y - boss.position.y;
    const targetX = playerPosition.value.x - Math.sign(dx);
    const targetY = playerPosition.value.y - Math.sign(dy);

    if (isValidMove({x: targetX, y: targetY})) {
      boss.position.x = targetX;
      boss.position.y = targetY;
      boss.isPreparingAttack = true;

      setTimeout(() => {
        boss.isPreparingAttack = false;
      }, 500);
    }
  }
};

const startAnimation = () => {
  if (animationInterval) clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % 4;
    enemyFrame.value = (enemyFrame.value + 1) % 4;
  }, ANIMATION_SPEED);
};

// Funktion zum Finden einer freien Spawn-Position
const findSpawnPosition = () => {
  const maxAttempts = 20;
  let attempts = 0;
  while (attempts < maxAttempts) {
    const x = Math.floor(Math.random() * dungeonMap.value[0].length);
    const y = Math.floor(Math.random() * dungeonMap.value.length);
    if ((dungeonMap.value[y][x] >= 20 && dungeonMap.value[y][x] <= 29) && // Kein Wandfeld
        !enemies.value.some(e => e.health > 0 && e.position.x === x && e.position.y === y) && // Kein Feind
        Math.abs(x - playerPosition.value.x) > 1 && // Nicht zu nah am Spieler (X-Achse)
        Math.abs(y - playerPosition.value.y) > 1) { // Nicht zu nah am Spieler (Y-Achse)
      return {x, y};
    }
    attempts++;
  }

  return null;
};

// Funktion zum Spawnen eines neuen Feindes
const spawnEnemy = () => {
  if (currentMap.value.type === 'boss' || currentMap.value.allowedEnemyTypes.length === 0) {
    return;
  }

  if (enemies.value.filter(e => e.health > 0).length >= SPAWN_CONFIG.maxEnemies) {
    return;
  }

  const position = findSpawnPosition();
  if (!position) return;

  const allowedTypes = currentMap.value.allowedEnemyTypes.filter(type => type !== 'BOSS');
  const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

  const newEnemy = {
    id: nextEnemyId++,
    type: 'default',
    name: randomType,
    position: position,
    direction: Math.random() > 0.5 ? 'left' : 'right',
    state: 'idle',
    frame: 0,
    health: ENEMY_TYPES[randomType].maxHealth,
    maxHealth: ENEMY_TYPES[randomType].maxHealth,
    spriteSize: ENEMY_TYPES[randomType].spriteSize,
    canAttack: true,
    isPreparingAttack: false,
    isUnderAttack: false,
    moveInterval: null
  };

  enemies.value.push(newEnemy);
  startEnemyMovement(newEnemy);
};

const moveEnemy = (enemy) => {
  // Wenn der Feind einen Angriff vorbereitet, nicht bewegen
  if (enemy.isPreparingAttack) return;

  const dx = playerPosition.value.x - enemy.position.x;
  const dy = playerPosition.value.y - enemy.position.y;
  const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

  // Nutze die intelligence direkt aus dem ENEMY_TYPES
  const intelligence = ENEMY_TYPES[enemy.name].intelligence || 0.5;

  let movePatterns = [];

  // Intelligente Bewegung in Richtung Spieler
  if (Math.random() < intelligence) {
    if (Math.abs(dx) > Math.abs(dy)) {
      movePatterns.push({dx: Math.sign(dx), dy: 0});
      movePatterns.push({dx: 0, dy: Math.sign(dy)});
    } else {
      movePatterns.push({dx: 0, dy: Math.sign(dy)});
      movePatterns.push({dx: Math.sign(dx), dy: 0});
    }
  }

  // Basis Bewegungsmuster
  let randomPatterns = [
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: -1},
    {dx: 0, dy: 1}
  ];

  // Füge diagonale Bewegungen für hohe Intelligenz hinzu
  if (intelligence >= 0.7) {
    randomPatterns = [
      ...randomPatterns,
      {dx: -1, dy: -1},
      {dx: 1, dy: -1},
      {dx: -1, dy: 1},
      {dx: 1, dy: 1}
    ];
  }

  movePatterns = [
    ...movePatterns,
    ...randomPatterns
  ];

  // Gewichtete Auswahl der Bewegung basierend auf Intelligenz
  let selectedMove;
  if (movePatterns.length > 0) {
    if (Math.random() < intelligence && movePatterns.length > 2) {
      // Intelligente Bewegung: Wähle aus den ersten beiden Optionen
      selectedMove = movePatterns[Math.floor(Math.random() * 2)];
    } else {
      // Zufällige Bewegung
      selectedMove = movePatterns[Math.floor(Math.random() * movePatterns.length)];
    }
  }

  if (!selectedMove) return;

  const newPosition = {
    x: enemy.position.x + selectedMove.dx,
    y: enemy.position.y + selectedMove.dy
  };

  // Aktualisiere die Richtung des Feindes
  if (selectedMove.dx !== 0) {
    enemy.direction = selectedMove.dx > 0 ? 'right' : 'left';
  }

  // Bewegungsvalidierung
  if (isValidEnemyMove(newPosition, enemy)) {
    enemy.position = newPosition;
    enemy.state = 'run';

    setTimeout(() => {
      if (!enemy.isPreparingAttack) {
        enemy.state = 'idle';
      }
    }, 300);
  }
};

const startEnemyMovement = (enemy = null) => {
  if (enemy) {
    if (enemy.moveInterval) clearInterval(enemy.moveInterval);
    if (enemy.health > 0) {
      enemy.moveInterval = setInterval(() => {
        moveEnemy(enemy);
      }, ENEMY_TYPES[enemy.name].moveSpeed);
    }
  } else {
    enemies.value.forEach(e => startEnemyMovement(e));
  }
};

const canEnemyAttackPlayer = (enemy) => {
  if (!enemy.canAttack || enemy.health <= 0 || enemy.isPreparingAttack) return false;

  const dx = Math.abs(playerPosition.value.x - enemy.position.x);
  const dy = Math.abs(playerPosition.value.y - enemy.position.y);

  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

const isValidEnemyMove = (newPosition, currentEnemy) => {
  const {x, y} = newPosition;

  // Grundlegende Kartenvalidierung
  if (!dungeonMap.value[y] ||
      dungeonMap.value[y][x] === undefined ||
      dungeonMap.value[y][x] === 10 ||
      dungeonMap.value[y][x] === 99) {
    return false;
  }

  // Prüfe ob das Feld begehbar ist
  if (!(dungeonMap.value[y][x] >= 20 && dungeonMap.value[y][x] <= 29)) {
    return false;
  }

  // Kollision mit Spieler
  if (isSamePosition(newPosition, playerPosition.value)) {
    return false;
  }

  // Kollision mit anderen Feinden
  if (enemies.value.some(enemy =>
      enemy !== currentEnemy &&
      enemy.health > 0 &&
      isSamePosition(newPosition, enemy.position)
  )) {
    return false;
  }

  return true;
};

const enemyAttack = (enemy) => {
  if (!enemy.canAttack || enemy.health <= 0 || enemy.isPreparingAttack || gameState.value !== GAME_STATE.PLAYING) return;

  enemy.canAttack = false;
  enemy.isPreparingAttack = true;
  enemy.state = 'attack';

  const attackDelay = Math.random() *
      (ENEMY_CONFIG.attackDelay.max - ENEMY_CONFIG.attackDelay.min) +
      ENEMY_CONFIG.attackDelay.min;

  setTimeout(() => {
    if (enemy.health <= 0) {
      enemy.isPreparingAttack = false;
      return;
    }

    const dx = Math.abs(playerPosition.value.x - enemy.position.x);
    const dy = Math.abs(playerPosition.value.y - enemy.position.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      isUnderAttack.value = true;
      playerHealth.value -= ENEMY_TYPES[enemy.name].damage;

      if (playerHealth.value <= 0) {
        gameState.value = GAME_STATE.GAME_OVER;
        playerHealth.value = 0;
      }

      setTimeout(() => {
        isUnderAttack.value = false;
      }, 200);
    }

    enemy.isPreparingAttack = false;
    enemy.state = 'idle';

    setTimeout(() => {
      enemy.canAttack = true;
    }, ENEMY_CONFIG.attackDelay.min);
  }, attackDelay);
};

const checkForAttack = () => {
  enemies.value.forEach(enemy => {
    if (canEnemyAttackPlayer(enemy)) {
      enemyAttack(enemy);
    }
  });
};

const startAttackCheck = () => {
  if (attackCheckInterval) clearInterval(attackCheckInterval);
  attackCheckInterval = setInterval(checkForAttack, 500);
};

const startCharging = () => {
  if (isCharging.value || isAttacking.value || isWhirlwindAttacking.value || gameState.value !== GAME_STATE.PLAYING) return;

  if (!hasExecutedWhirlwind.value) {
    chargeStartTime.value = Date.now();
    isCharging.value = true;

    chargeTimer = setTimeout(() => {
      if (isCharging.value) {
        executeWhirlwindAttack();
        isCharging.value = false;
        chargeStartTime.value = null;
        hasExecutedWhirlwind.value = true;
      }
    }, CHARGE_TIME);
  }
};

const movePlayer = (dx, dy) => {
  if (gameState.value !== GAME_STATE.PLAYING) return;

  const newPosition = {
    x: playerPosition.value.x + dx,
    y: playerPosition.value.y + dy
  };

  if (dx !== 0) {
    playerDirection.value = dx > 0 ? 'right' : 'left';
  }

  playerState.value = 'run';

  if (isValidMove(newPosition)) {
    playerPosition.value = newPosition;
    checkTrapDamage(newPosition);

    // Prüfe Quest-Items
    if (activeQuest.value) {
      const questItem = questItems.value.find(item =>
          !item.collected &&
          item.x === newPosition.x &&
          item.y === newPosition.y
      );

      if (questItem) {
        questItem.collected = true;

        // Prüfe ob Quest abgeschlossen
        const collectedCount = questItems.value.filter(i => i.collected).length;
        activeQuest.value.count = collectedCount;
        if (collectedCount >= activeQuest.value.goal) {
          activeQuest.value.completed = true;
          // Belohnung geben
          if (activeQuest.value.gift === 'sword') {
            // Implementiere Belohnungslogik
          }
        }
      }
    }

    if (dungeonMap.value[newPosition.y][newPosition.x] === 98) {
      startNextLevel();
      return;
    }

    playerPosition.value = newPosition;

    const itemAtPosition = droppedItems.value.find(item =>
        !item.collectAnimation &&
        item.position.x === newPosition.x &&
        item.position.y === newPosition.y
    );

    if (itemAtPosition) {
      collectItem(itemAtPosition);
    }
  }
};

const showStairs = () => {
  isStairActive.value = true;
  const layout = currentMap.value.layout;

  // Finde Treppenposition und aktiviere sie
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === 98) {
        dungeonMap.value[y][x] = 98;
        break;
      }
    }
  }
};

const startNextLevel = () => {
  const nextMapIndex = currentMapIndex.value + 1;

  if (nextMapIndex < MAPS.length) {
    if (loadMap(nextMapIndex)) {
      playerHealth.value = Math.min(MAX_HEALTH, playerHealth.value + LEVEL_CONFIG.healthBonus);
    }
  } else {
    gameState.value = GAME_STATE.VICTORY;
  }
};

const restartGame = () => {
  gameState.value = GAME_STATE.PLAYING;
  playerHealth.value = MAX_HEALTH;
  coins.value = 0;
  loadMap(0);
};

let spawnInterval = null;
const startSpawnSystem = () => {
  if (currentMap.value.type === 'boss') {
    return;
  }

  const scheduleNextSpawn = () => {
    const delay = Math.random() *
        (SPAWN_CONFIG.maxInterval - SPAWN_CONFIG.minInterval) +
        SPAWN_CONFIG.minInterval;

    spawnInterval = setTimeout(() => {
      spawnEnemy();
      scheduleNextSpawn();
    }, delay);
  };

  setTimeout(() => {
    scheduleNextSpawn();
  }, SPAWN_CONFIG.initialDelay);
};

const executeAttack = () => {
  if (!isCharging.value || gameState.value !== GAME_STATE.PLAYING) return;

  if (chargeTimer) {
    clearTimeout(chargeTimer);
    chargeTimer = null;
  }

  const chargeTime = Date.now() - chargeStartTime.value;
  isCharging.value = false;
  chargeStartTime.value = null;

  // Nur normaler Angriff wenn vor 2 Sekunden losgelassen und kein Whirlwind ausgeführt
  if (chargeTime < CHARGE_TIME && !hasExecutedWhirlwind.value) {
    attackWithSword();
  }
};

const getTileObjects = (tile, rowIndex, tileIndex) => {
  if (tile === 30) {
    return traps.value.find(trap => trap.x === tileIndex && trap.y === rowIndex);
  }
  return null;
};

const initializeTrap = (x, y) => {
  traps.value.push({x, y, status: 'active'});
  const toggleTrapStatus = () => {
    const trap = traps.value.find(trap => trap.x === x && trap.y === y);
    if (!trap) return;
    trap.status = trap.status === 'active' ? 'idle' : 'active';
    if (trap.status === 'active') {
      checkTrapDamage(playerPosition.value);
    }
    trap.timerId = setTimeout(
        toggleTrapStatus,
        trap.status === 'active' ? TILES[30].trap.activeTime : TILES[30].trap.activationInterval
    );
  };
  // Starte den ersten Timer
  const trap = traps.value.find(trap => trap.x === x && trap.y === y);
  if (trap) {
    trap.timerId = setTimeout(toggleTrapStatus, TILES[30].trap.activeTime);
  }
  // Optional: Cleanup-Funktion zurückgeben
  return () => {
    const trap = traps.value.find(trap => trap.x === x && trap.y === y);
    if (trap && trap.timerId) {
      clearTimeout(trap.timerId);
    }
  };
};

const checkTrapDamage = (playerPosition) => {
  const trap = traps.value.find(trap => trap.x === playerPosition.x && trap.y === playerPosition.y);
  if (trap && trap.status === 'active') {
    playerHealth.value -= 1;
    if (playerHealth.value <= 0) {
      gameState.value = GAME_STATE.GAME_OVER;
      playerHealth.value = 0;
    }
  }
};

const handleKeydown = (e) => {
  if ((gameState.value === GAME_STATE.GAME_OVER || gameState.value === GAME_STATE.VICTORY) && e.key === 'r') {
    restartGame();
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
    case 's':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
    case 'a':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
      movePlayer(1, 0);
      break;
    case 'e':
      startCharging();
      break;
  }
};

const handleKeyup = (e) => {
  if (e.key === 'e') {
    executeAttack();
    hasExecutedWhirlwind.value = false;
  }
  playerState.value = 'idle';
};

onMounted(() => {
  loadMap(0);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
  startAnimation();
  startEnemyMovement();
  startSpawnSystem();
  startAttackCheck();
});

onUnmounted(() => {
  if (spawnInterval) clearTimeout(spawnInterval);
  if (chargeTimer) clearTimeout(chargeTimer);
  enemies.value.forEach(enemy => {
    if (enemy.moveInterval) clearInterval(enemy.moveInterval);
  });
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keyup', handleKeyup);
  if (animationInterval) clearInterval(animationInterval);
  if (attackCheckInterval) clearInterval(attackCheckInterval);
});

// Watch für Game Over Status
watch(() => gameState.value, (newState) => {
  if (newState === GAME_STATE.GAME_OVER) {
    if (spawnInterval) clearTimeout(spawnInterval);
    enemies.value.forEach(enemy => {
      if (enemy.moveInterval) clearInterval(enemy.moveInterval);
    });
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
        <GameUI :player-health="playerHealth" :coins="coins" :current-map="currentMap" :defeated-enemies="defeatedEnemies" :enemies="enemies"></GameUI>
        <Overlay :game-state="gameState" :coins="coins"></Overlay>
        <div class="dungeon-container">
          <div
            v-for="(row, rowIndex) in dungeonMap"
            :key="rowIndex"
            class="map-row"
          >
            <Tile
              v-for="(tile, tileIndex) in row"
              :key="`${rowIndex}-${tileIndex}`"
              :tile="tile"
              :tile-object="getTileObjects(tile, rowIndex, tileIndex)"
            />
          </div>
          <Player
            :position="playerPosition"
            :health="playerHealth"
            :is-attacking="isAttacking"
            :is-charging="isCharging"
            :is-whirlwind-attacking="isWhirlwindAttacking"
            :is-under-attack="isUnderAttack"
            :game-state="gameState"
            :player-state="playerState"
            :direction="playerDirection"
          />
          <Enemy
            v-for="enemy in enemies"
            :key="enemy.id"
            :enemy="enemy"
            :active-enemies-near-player="activeEnemiesNearPlayer"
          />
          <Item v-for="item in droppedItems" :key="item.id" :item="item" />
          <template
            v-if="currentMap.type === 'quest'"
          >
            <NPC
              :quest="currentMap.quest"
              :player-position="playerPosition"
              @start-quest="startQuest"
              @show-stairs="showStairs"
            />
            <Item
              v-for="item in questItems"
              :key="`${item.x}-${item.y}`"
              :item="{position: {x: item.x, y: item.y}, name: item.name, type: item.type, collectAnimation: item.collected}"
            />
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
  .game-container {
    position: relative;
    overflow: hidden;
  }

  .dungeon-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    image-rendering: pixelated;
    -webkit-font-smoothing: none;
  }

  .map-row {
    display: flex;
  }
</style>