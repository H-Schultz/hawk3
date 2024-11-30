<script setup>
import {ref, onMounted, onUnmounted, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {
  GAME_STATE, MAPS,
  MAX_HEALTH, LEVEL_CONFIG, SPECIAL_DURATION,
  SPAWN_CONFIG, ENEMY_CONFIG, ENEMY_TYPES, TILES, WEAPON_CONFIG, PLAYER_CONFIG, ITEM_TYPES, MAX_MANA
} from './constants.js';
import Player from './Player.vue';
import Enemy from './Enemy.vue';
import Item from './Item.vue';
import GameUI from './GameUI.vue';
import Overlay from './Overlay.vue';
import Tile from './Tile.vue';
import NPC from './NPC.vue';
import Explosion from './Explosion.vue';
import Camera  from './Camera.vue';

let chargeTimer = null;

const droppedItems = ref([]);
const gameState = ref(GAME_STATE.PLAYING);
const defeatedEnemies = ref(0);
const currentMapIndex = ref(0);
const currentMap = ref([]);
const isStairActive = ref(false);
const dungeonMap = ref(null);
const router = useRouter();
const activeQuest = ref(0);
const questItems = ref([]);
const traps = ref([]);
const activeExplosions = ref([]);

const player = ref({
  position: { x: 1, y: 1 },
  health: MAX_HEALTH,
  maxHealth: MAX_HEALTH,
  mana: MAX_MANA,
  maxMana: MAX_MANA,
  manaRegeneration: 10000,
  direction: 'right',
  state: 'idle',
  weapon: WEAPON_CONFIG.AXE,
  character: PLAYER_CONFIG.KNIGHT,
  isAttacking: false,
  isCharging: false,
  isSpecialAttacking: false,
  isUnderAttack: false,
  hasExecutedSpecial: false,
  chargeStartTime: null,
  coins: 0,
  keys: 0,
  bombs: 0,
  gameState
});

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

    const dx = Math.abs(player.value.position.x - enemy.position.x);
    const dy = Math.abs(player.value.position.y - enemy.position.y);
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
  traps.value.forEach(trap => {
    if (trap.timerId) {
      clearTimeout(trap.timerId);
    }
  });
  traps.value = [];

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === 90) {
        startPos = {x, y};
      }
      if (layout[y][x] === 30) {
        traps.value.push({x, y, status: 'active'});
      }
    }
  }

  if (traps.value.length > 0) {
    initializeTraps();
  }

  player.value.position = startPos;
  defeatedEnemies.value = 0;
  enemies.value = [];
  droppedItems.value = [];
  initChestItems();

  if (mapData.type === 'quest') {
    activeQuest.value = mapData.quests[0];
    activeQuest.value.started = false;
    activeQuest.value.completed = false;
    activeQuest.value.count = 0;
    activeQuest.value.isReady = false;
    questItems.value = [];
  } else {
    activeQuest.value = null;
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
  }

  return true;
};

const initializeTraps = () => {
  traps.value.forEach(trap => {
    initializeTrap(trap.x, trap.y);
  });
};

const initializeTrap = (x, y) => {
  const toggleTrapStatus = () => {
    const trap = traps.value.find(trap => trap.x === x && trap.y === y);
    if (!trap) return;
    trap.status = trap.status === 'active' ? 'idle' : 'active';
    if (trap.status === 'active' && player.value.position.x === x && player.value.position.y === y) {

      console.log('active Trap', trap, x, y, trap.timerId);
      checkTrapDamage(player.value.position);
    }
    trap.timerId = setTimeout(
        toggleTrapStatus,
        trap.status === 'active' ? TILES[30].trap.activeTime : TILES[30].trap.activationInterval
    );
  };
  const trap = traps.value.find(trap => trap.x === x && trap.y === y);
  if (trap) {
    console.log('Init Trap', trap, x, y, trap.timerId);
    trap.timerId = setTimeout(toggleTrapStatus, TILES[30].trap.activeTime);
  }
};

const startQuest = (quest) => {
  if (quest.completed || quest.started) return;
  activeQuest.value = quest;
  activeQuest.value.started = true;
  activeQuest.value.count = 0;
  activeQuest.value.completed = false;
  activeQuest.value.isReady = false;

  // Initialisiere Quest-Items
  questItems.value = quest.spots
      .filter(spot => spot.name === 'item')
      .map(spot => ({
        ...spot,
        collected: false
      }));

  // Initialisiere Quest-spezifische Feinde
  const questEnemies = quest.spots
      .filter(spot => spot.name === 'enemy')
      .map(spot => ({
        id: nextEnemyId++,
        type: 'default',
        name: spot.type,
        position: { x: spot.x, y: spot.y },
        direction: 'left',
        state: 'idle',
        frame: 0,
        health: ENEMY_TYPES[spot.type].maxHealth,
        maxHealth: ENEMY_TYPES[spot.type].maxHealth,
        spriteSize: ENEMY_TYPES[spot.type].spriteSize,
        canAttack: true,
        isPreparingAttack: false,
        isUnderAttack: false,
        moveInterval: null,
        isQuestEnemy: true
      }));

  // Füge die Quest-Feinde dem enemies Array hinzu
  enemies.value = [
    ...enemies.value,
    ...questEnemies
  ];

  // Starte die Bewegung für die neuen Quest-Feinde
  questEnemies.forEach(enemy => startEnemyMovement(enemy));
};

const isNearNPC = (quest) => {
  if (!quest?.npc) return false;
  const dx = Math.abs(player.value.position.x - quest.npc.x);
  const dy = Math.abs(player.value.position.y - quest.npc.y);
  return (dx <= 1 && dy <= 1);
};

const checkQuestProgress = () => {
  if (!activeQuest.value || !activeQuest.value.started) return;

  // Zähle gesammelte Tränke
  let progress = questItems.value.filter(item => item.collected).length;

  // Hat Quest auch Feinde?
  let defeatedQuestEnemies = 0;
  let questEnemies = activeQuest.value.spots.filter(spot => spot.name === 'enemy');
  if (questEnemies.length > 0) {
    // Prüfe auch besiegte Quest-Feinde
    defeatedQuestEnemies = enemies.value
        .filter(enemy => enemy.isQuestEnemy && enemy.health <= 0)
        .length;
  }

  activeQuest.value.count = progress;

  // Prüfe ob alle Bedingungen erfüllt sind
  const allEnemiesDefeated = defeatedQuestEnemies >= questEnemies.length;
  const allItemsCollected = progress + defeatedQuestEnemies >= activeQuest.value.goal;

  // Speichere den Fortschritt
  activeQuest.value.isReady = allItemsCollected && allEnemiesDefeated;

  // Setze completed nur wenn alle Bedingungen erfüllt sind UND Spieler beim NPC ist
  if (activeQuest.value.isReady && isNearNPC(activeQuest.value)) {
    activeQuest.value.completed = true;

    // Optional: Hier könnte man eine Belohnung geben oder andere Aktionen ausführen

    // Prüfe ob alle Quests abgeschlossen sind
    const allQuestsCompleted = currentMap.value.quests.every(quest => quest.completed);
    if (allQuestsCompleted) {
      showStairs();
    }
  }
};

const dropItem = (enemy) => {
  if (droppedItems.value.some(item => isSamePosition(item.position, enemy.position))) return;

  if (enemy.isQuestEnemy) {
    checkQuestProgress();
    return;
  }

  const dropChance = Math.random();
  if (dropChance > enemy.dropChance) return;

  const itemTypes = currentMap.value.allowedItems || [];
  if (itemTypes.length === 0) return;
  const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  droppedItems.value.push({
    id: Math.random().toString(36).substr(2, 9),
    type: randomItem,
    config: ITEM_TYPES[randomItem],
    position: {...enemy.position},
    collectAnimation: false
  });
};

const initChestItems = () => {
  const chestSpots = currentMap.value.chests || [];
  droppedItems.value = chestSpots.map(spot => ({
    id: Math.random().toString(36).substr(2, 9),
    type: spot.type,
    config: ITEM_TYPES[spot.type],
    position: {x: spot.x, y: spot.y},
    state: 'closed',
  }));
};

// Funktion zum Einsammeln von Items
const collectItem = (item) => {
  if (item.dropped) return;
  item.collectAnimation = true;
  setTimeout(() => {
    if (item.type === 'COIN') {
      player.value.coins++;
    } else if (item.type === 'RED_KEY') {
      player.value.keys++;
    } else if (item.type === 'HEART') {
      player.value.maxHealth++;
      player.value.health = Math.min(player.value.maxHealth, player.value.health + 1);
    } else if (item.type === 'MANA') {
      player.value.maxMana++;
      player.value.mana = Math.min(player.value.maxMana, player.value.mana + 1);
    } else if (item.type === 'BLUE_POTION') {
      player.value.mana = Math.min(player.value.maxMana, player.value.mana + 1);
    } else if (item.type === 'RED_POTION') {
      player.value.health = Math.min(player.value.maxHealth, player.value.health + 1);
    } else if (item.type === 'GREEN_POISON') {
      player.value.health -= ITEM_TYPES.GREEN_POISON.damage;
      if (player.value.health <= 0) {
        gameState.value = GAME_STATE.GAME_OVER;
        player.value.health = 0;
      }
    } else if (item.type === 'BOMB') {
      player.value.bombs++;
    }
    droppedItems.value = droppedItems.value.filter(i => i.id !== item.id);
  }, 200);
};

const destroyItem = (item) => {
  const findItem = droppedItems.value.find(i => i.id === item.id);
  if (findItem) findItem.destroyAnimation = true;
  setTimeout(() => {
    droppedItems.value = droppedItems.value.filter(i => i.id !== item.id);
  }, 400);
};

const isValidMove = (position) => {
  const {x, y} = position;

  if (!dungeonMap.value[y] ||
      dungeonMap.value[y][x] === undefined ||
      (dungeonMap.value[y][x] >= 10 && dungeonMap.value[y][x] <= 19)) {
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

  if (droppedItems.value.some(item =>
      item.config.barrier &&
      item.position.x === position.x &&
      item.position.y === position.y
  )) {
    return false;
  }

  if (activeQuest.value) {
    const npc = activeQuest.value.npc;
    if (npc && npc.x === position.x && npc.y === position.y) {
      return false;
    }
  }

  return true;
};

// Funktion zum Überprüfen der Angriffsrichtung
const getAttackPosition = () => {
  const position = {...player.value.position};

  switch (player.value.direction) {
    case 'right':
      position.x += 1;
      break;
    case 'left':
      position.x -= 1;
      break;
  }

  return position;
};

const attackWithSword = () => {
  if (player.value.isAttacking || gameState.value !== GAME_STATE.PLAYING) return;

  player.value.isAttacking = true;
  const attackPos = getAttackPosition();
  const itemAtPosition = droppedItems.value.find(item =>
      item.config.destroyable &&
      item.position.x === attackPos.x &&
      item.position.y === attackPos.y
  );
  if (itemAtPosition) {
    destroyItem(itemAtPosition);
  }

  enemies.value.forEach(enemy => {
    if (enemy.health > 0 &&
        enemy.position.x === attackPos.x &&
        enemy.position.y === attackPos.y) {
      enemy.health--;

      if (enemy.health <= 0) {
        defeatedEnemies.value++;
        dropItem(enemy);

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
    player.value.isAttacking = false;
  }, 400);
};

const executeLightningAttack = () => {
  player.value.isSpecialAttacking = true;
  player.value.mana = Math.max(0, player.value.mana - 1);

  const lightningPositions = [
    // Up
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    // Down
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    // Left
    { x: -1, y: 0 },
    { x: -2, y: 0 },
    // Right
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ];

  const applyLightningDamage = (positions) => {
    enemies.value.forEach(enemy => {
      if (enemy.health > 0) {
        const isInRange = positions.some(pos =>
            enemy.position.x === player.value.position.x + pos.x &&
            enemy.position.y === player.value.position.y + pos.y
        );

        if (isInRange) {
          enemy.health -= 1;
          enemy.isUnderAttack = true;

          if (enemy.health <= 0) {
            defeatedEnemies.value++;
            dropItem(enemy);

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

    const destroyedItems = droppedItems.value.filter(item =>
        item.config.destroyable &&
        positions.some(pos =>
            item.position.x === player.value.position.x + pos.x &&
            item.position.y === player.value.position.y + pos.y
        )
    );

    if (destroyedItems?.length > 0) {
      destroyedItems.forEach(item => {
        if (!item.destroyAnimation) destroyItem(item);
      });
    }
  };

  // First lightning strike
  setTimeout(() => {
    applyLightningDamage(lightningPositions);
  }, 200);

  // Animation end
  setTimeout(() => {
    player.value.isSpecialAttacking = false;
  }, 400);
};

const executeSpecialAttack = () => {
  const oldDropItems = JSON.parse(JSON.stringify(droppedItems.value));
  player.value.isSpecialAttacking = true;
  player.value.mana = Math.max(0, player.value.mana - 1);

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
    applySpecialDamage(surroundingPositions, oldDropItems);
  }, 200);

  // Zweiter Treffer nach 400ms (1/2 Rotation)
  setTimeout(() => {
    applySpecialDamage(surroundingPositions, oldDropItems);
  }, 400);

  // Dritter Treffer nach 600ms (3/4 Rotation)
  setTimeout(() => {
    applySpecialDamage(surroundingPositions, oldDropItems);
  }, 600);

  // Letzter Treffer nach 800ms (volle Rotation)
  setTimeout(() => {
    applySpecialDamage(surroundingPositions, oldDropItems);
    player.value.isSpecialAttacking = false;
  }, SPECIAL_DURATION);
};

const applySpecialDamage = (surroundingPositions, oldDropItems) => {
  enemies.value.forEach(enemy => {
    if (enemy.health > 0) {
      const isInRange = surroundingPositions.some(pos =>
          enemy.position.x === player.value.position.x + pos.x &&
          enemy.position.y === player.value.position.y + pos.y
      );

      if (isInRange) {
        enemy.health -= 1;
        enemy.isUnderAttack = true;

        if (enemy.health <= 0) {
          defeatedEnemies.value++;
          dropItem(enemy);

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

  const destroyedItems = oldDropItems.filter(item => {
    if (item.config.destroyable && surroundingPositions.some(pos =>
        item.position.x === player.value.position.x + pos.x &&
        item.position.y === player.value.position.y + pos.y)) {
      return true;
    }
    return false;
  });
  if (destroyedItems?.length > 0) {
    destroyedItems.forEach(item => {
      if (!item.destroyAnimation) destroyItem(item);
    });
  }
};

const findSpawnPosition = () => {
  const maxAttempts = 20;
  let attempts = 0;
  const spawnRadius = 5; // Radius around player to spawn enemies

  while (attempts < maxAttempts) {
    // Generate random position within spawn radius of player
    const offsetX = Math.floor(Math.random() * (spawnRadius * 2 + 1)) - spawnRadius;
    const offsetY = Math.floor(Math.random() * (spawnRadius * 2 + 1)) - spawnRadius;

    const x = player.value.position.x + offsetX;
    const y = player.value.position.y + offsetY;

    // Validate position
    if (dungeonMap.value[y] && dungeonMap.value[y][x] !== undefined &&
        (dungeonMap.value[y][x] >= 20 && dungeonMap.value[y][x] <= 29) &&
        !enemies.value.some(e => e.health > 0 && e.position.x === x && e.position.y === y) &&
        (Math.abs(offsetX) > 1 || Math.abs(offsetY) > 1)) { // Not too close to player
      return {x, y};
    }
    attempts++;
  }
  return null;
};

const despawnDistantEnemies = () => {
  const maxDistance = 8; // Maximum distance before despawning

  enemies.value = enemies.value.filter(enemy => {
    if (enemy.health <= 0 || enemy.isQuestEnemy) return true;

    const dx = Math.abs(enemy.position.x - player.value.position.x);
    const dy = Math.abs(enemy.position.y - player.value.position.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      if (enemy.moveInterval) clearInterval(enemy.moveInterval);
      return false;
    }
    return true;
  });
};

let spawnInterval = null;
const startSpawnSystem = () => {
  if (currentMap.value.type === 'boss') return;

  // Add regular despawn check
  setInterval(despawnDistantEnemies, 1000);

  const scheduleNextSpawn = () => {
    const delay = Math.random() *
        (SPAWN_CONFIG.maxInterval - SPAWN_CONFIG.minInterval) +
        SPAWN_CONFIG.minInterval;

    spawnInterval = setTimeout(() => {
      if (enemies.value.filter(e => e.health > 0).length < currentMap.value.maxEnemies) {
        spawnEnemy();
      }
      scheduleNextSpawn();
    }, delay);
  };

  setTimeout(scheduleNextSpawn, SPAWN_CONFIG.initialDelay);
};

const spawnEnemy = () => {
  if (currentMap.value.type === 'boss' || currentMap.value.allowedEnemyTypes.length === 0) {
    return;
  }

  if (enemies.value.filter(e => e.health > 0).length >= currentMap.value.maxEnemies) {
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
  if (enemy.isPreparingAttack) return;

  const dx = player.value.position.x - enemy.position.x;
  const dy = player.value.position.y - enemy.position.y;
  const intelligence = ENEMY_TYPES[enemy.name].intelligence || 0.5;
  let movePatterns = [];

  if (Math.random() < intelligence) {
    if (Math.abs(dx) > Math.abs(dy)) {
      movePatterns.push({dx: Math.sign(dx), dy: 0});
      movePatterns.push({dx: 0, dy: Math.sign(dy)});
    } else {
      movePatterns.push({dx: 0, dy: Math.sign(dy)});
      movePatterns.push({dx: Math.sign(dx), dy: 0});
    }
  }

  let randomPatterns = [
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: -1},
    {dx: 0, dy: 1}
  ];

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

  let selectedMove;
  if (movePatterns.length > 0) {
    if (Math.random() < intelligence && movePatterns.length > 2) {
      selectedMove = movePatterns[Math.floor(Math.random() * 2)];
    } else {
      selectedMove = movePatterns[Math.floor(Math.random() * movePatterns.length)];
    }
  }

  if (!selectedMove) return;

  const newPosition = {
    x: enemy.position.x + selectedMove.dx,
    y: enemy.position.y + selectedMove.dy
  };

  if (selectedMove.dx !== 0) {
    enemy.direction = selectedMove.dx > 0 ? 'right' : 'left';
  }

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

  const dx = Math.abs(player.value.position.x - enemy.position.x);
  const dy = Math.abs(player.value.position.y - enemy.position.y);

  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

const isValidEnemyMove = (newPosition, currentEnemy) => {
  const {x, y} = newPosition;

  // Grundlegende Kartenvalidierung
  if (!dungeonMap.value[y] ||
      dungeonMap.value[y][x] === undefined ||
      (dungeonMap.value[y][x] >= 10 && dungeonMap.value[y][x] <= 19)) {
    return false;
  }

  // Prüfe ob das Feld begehbar ist
  if (!(dungeonMap.value[y][x] >= 20 && dungeonMap.value[y][x] <= 29)) {
    return false;
  }

  // Kollision mit Spieler
  if (isSamePosition(newPosition, player.value.position)) {
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

  // keine Kiste
  if (droppedItems.value.some(item =>
      item.config.barrier &&
      item.position.x === x &&
      item.position.y === y
  )) {
    return false;
  }

  // kein NPC
  if (activeQuest.value) {
    const npc = activeQuest.value.npc;
    if (npc && npc.x === x && npc.y === y) {
      return false;
    }
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

    const dx = Math.abs(player.value.position.x - enemy.position.x);
    const dy = Math.abs(player.value.position.y - enemy.position.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      player.value.isUnderAttack = true;
      player.value.health -= ENEMY_TYPES[enemy.name].damage;

      if (player.value.health <= 0) {
        gameState.value = GAME_STATE.GAME_OVER;
        player.value.health = 0;
      }

      setTimeout(() => {
        player.value.isUnderAttack = false;
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
  if (player.value.isCharging || player.value.isAttacking || player.value.isSpecialAttacking || gameState.value !== GAME_STATE.PLAYING) return;

  if (!player.value.hasExecutedSpecial) {
    player.value.chargeStartTime = Date.now();
    player.value.isCharging = true;

    chargeTimer = setTimeout(() => {
      if (player.value.isCharging && player.value.mana > 0) {
        if (player.value.weapon.name === 'wand') {
          executeLightningAttack();
        } else {
          executeSpecialAttack();
        }
        player.value.isCharging = false;
        player.value.chargeStartTime = null;
        player.value.hasExecutedSpecial = true;
      }
    }, player.value.weapon.chargeTime);
  }
};

const movePlayer = (dx, dy) => {
  if (gameState.value !== GAME_STATE.PLAYING) return;

  const newPosition = {
    x: player.value.position.x + dx,
    y: player.value.position.y + dy
  };

  if (dx !== 0) {
    player.value.direction = dx > 0 ? 'right' : 'left';
  }

  player.value.state = 'run';

  if (isValidMove(newPosition)) {
    player.value.position = newPosition;
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
        collectItem(questItem);
      }
      checkQuestProgress();
    }

    if (dungeonMap.value[newPosition.y][newPosition.x] === 98) {
      startNextLevel();
      return;
    }

    const itemAtPosition = droppedItems.value.find(item =>
        !item.collectAnimation &&
        item.position.x === newPosition.x &&
        item.position.y === newPosition.y
    );

    if (itemAtPosition) {
      collectItem(itemAtPosition);
    }
  }

  checkKeyMovement();
};

const showStairs = () => {
  if (currentMap.value.quests?.length > 0) {
    const allQuestsCompleted = currentMap.value.quests.every(quest => quest.completed);
    if (!allQuestsCompleted) {
      return;
    }
  }

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
  const gameContainer = document.querySelector('.game-container');
  gameContainer.classList.add('flip-out');

  setTimeout(() => {
    const nextMapIndex = currentMapIndex.value + 1;

    if (nextMapIndex < MAPS.length) {
      if (loadMap(nextMapIndex)) {
        player.value.health = Math.min(MAX_HEALTH, player.value.health + LEVEL_CONFIG.healthBonus);
      }
    } else {
      gameState.value = GAME_STATE.VICTORY;
    }

    setTimeout(() => {
      gameContainer.classList.remove('flip-out');
      gameContainer.classList.add('flip-in');

      gameContainer.classList.remove('flip-in');
    }, 300);
  }, 300);
};

const restartGame = () => {
  location.reload();
};

const executeAttack = () => {
  if (!player.value.isCharging || gameState.value !== GAME_STATE.PLAYING) return;

  if (chargeTimer) {
    clearTimeout(chargeTimer);
    chargeTimer = null;
  }

  const chargeTime = Date.now() - player.value.chargeStartTime;
  player.value.isCharging = false;
  player.value.chargeStartTime = null;

  // Nur normaler Angriff wenn vor 2 Sekunden losgelassen und kein Special ausgeführt
  if (chargeTime < player.value.weapon.chargeTime && !player.value.hasExecutedSpecial) {
    attackWithSword();
  }
};

const getTileObjects = (tile, rowIndex, tileIndex) => {
  if (tile === 30) {
    return traps.value.find(trap => trap.x === tileIndex && trap.y === rowIndex);
  } else {
    return TILES[tile];
  }
  return null;
};

const checkTrapDamage = (playerPosition) => {
  const trap = traps.value.find(trap => trap.x === playerPosition.x && trap.y === playerPosition.y);
  if (trap && trap.status === 'active') {
    player.value.isUnderAttack = true;
    player.value.health -= 1;
    if (player.value.health <= 0) {
      gameState.value = GAME_STATE.GAME_OVER;
      player.value.health = 0;
    }

    setTimeout(() => {
      player.value.isUnderAttack = false;
    }, 200);
  }
};

const placeBomb = () => {
  if (player.value.bombs <= 0 || gameState.value !== GAME_STATE.PLAYING) return;
  if (droppedItems.value.some(item => item.type === 'BOMB_BURN' && isSamePosition(item.position, player.value.position))) {
    return;
  }
  player.value.bombs--;
  const bombPosition = {...player.value.position};
  const bombId = Math.random().toString(36).substr(2, 9);

  droppedItems.value.push({
    id: bombId,
    type: 'BOMB_BURN',
    config: ITEM_TYPES.BOMB_BURN,
    position: bombPosition,
    collectAnimation: false,
    dropped: true
  });

  // Füge einen visuellen Countdown-Effekt zur Bombe hinzu
  setTimeout(() => {
    explodeBomb(bombId, bombPosition);
  }, 2000);
};

const explodeBomb = (bombId, bombPosition) => {
  const bomb = droppedItems.value.find(item => item.id === bombId);
  if (!bomb) return;

  const explosionPositions = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1}
  ];

  const affectedPositions = [
    bombPosition,
    ...explosionPositions.map(pos => ({
      x: bombPosition.x + pos.x,
      y: bombPosition.y + pos.y
    }))
  ];

  const explosionGroup = affectedPositions.map(pos => ({
    id: `${bombId}-${pos.x}-${pos.y}`,
    bombId,
    position: pos
  }));

  activeExplosions.value = [
    ...activeExplosions.value,
    ...explosionGroup
  ];

  setTimeout(() => {
    activeExplosions.value = activeExplosions.value.filter(
        explosion => explosion.bombId !== bombId
    );
  }, 500);

  enemies.value.forEach(enemy => {
    if (enemy.health > 0 && affectedPositions.some(pos =>
        enemy.position.x === pos.x &&
        enemy.position.y === pos.y
    )) {
      enemy.health = 0;
      defeatedEnemies.value++;
      dropItem(enemy);
    }
  });

  if (affectedPositions.some(pos =>
      player.value.position.x === pos.x &&
      player.value.position.y === pos.y
  )) {
    player.value.isUnderAttack = true;
    player.value.health -= 1;
    if (player.value.health <= 0) {
      gameState.value = GAME_STATE.GAME_OVER;
      player.value.health = 0;
    }
    setTimeout(() => {
      player.value.isUnderAttack = false;
    }, 200);
  }

  affectedPositions.forEach(pos => {
    if (dungeonMap.value[pos.y] &&
        dungeonMap.value[pos.y][pos.x] === 19) {
      dungeonMap.value[pos.y][pos.x] = 20;
    }
  });

  const destroyedItems = droppedItems.value.filter(item =>
      item.config.destroyable &&
      affectedPositions.some(pos =>
          item.position.x === pos.x &&
          item.position.y === pos.y
      )
  );

  if (destroyedItems?.length > 0) {
    destroyedItems.forEach(item => {
      if (!item.destroyAnimation) destroyItem(item);
    });
  }

  droppedItems.value = droppedItems.value.filter(item => item.id !== bombId);
};

const dropGift = () => {
  if (!activeQuest.value) return;
  const positionX = activeQuest.value.npc.x + (activeQuest.value.npc.direction === 'left' ? -1 : 1);

  droppedItems.value.push({
    id: Math.random().toString(36).substr(2, 9),
    type: activeQuest.value.gift,
    config: ITEM_TYPES[activeQuest.value.gift],
    position: {x: positionX, y: activeQuest.value.npc.y},
    collectAnimation: false
  });
};

const checkKeyMovement = () => {
  if (player.value.keys <= 0 || gameState.value !== GAME_STATE.PLAYING) return;

  const keyPosition = getAttackPosition();
  const door = dungeonMap.value[keyPosition.y][keyPosition.x] === 13;
  if (door) {
    dungeonMap.value[keyPosition.y][keyPosition.x] = 20;
    player.value.keys--;
  }

  const chest = droppedItems.value.find(item =>
      item.type.includes('CHEST') &&
      item.position.x === keyPosition.x &&
      item.position.y === keyPosition.y
  );
  if (chest && chest.state === 'closed') {
    chest.state = 'opened';
    player.value.keys--;
    setTimeout(() => {
      chest.state = 'empty';
    }, 1000);

    if (chest.type === 'CHEST_GOLD') {
      const directions = [
        {dx: -1, dy: -1},
        {dx: 1, dy: -1},
        {dx: -1, dy: 1},
        {dx: 1, dy: 1},
        {dx: 0, dy: -1},
        {dx: 0, dy: 1},
        {dx: -1, dy: 0},
        {dx: 1, dy: 0}
      ];

      const maxItems = directions.length;
      const coins = Math.min(Math.floor(Math.random() * 3) + 1, maxItems);
      const otherItems = Math.min(Math.floor(Math.random() * 4) + 1, maxItems - coins);

      for (let i = 0; i < coins; i++) {
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        directions.splice(directions.indexOf(randomDirection), 1);
        const itemPosition = {
          x: keyPosition.x + randomDirection.dx,
          y: keyPosition.y + randomDirection.dy
        };

        droppedItems.value.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'COIN',
          config: ITEM_TYPES.COIN,
          position: itemPosition,
          collectAnimation: false
        });
      }

      for (let i = 0; i < otherItems; i++) {
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        directions.splice(directions.indexOf(randomDirection), 1);
        const itemPosition = {
          x: keyPosition.x + randomDirection.dx,
          y: keyPosition.y + randomDirection.dy
        };

        const randomItem = Math.random() < 0.5 ? 'HEART' : 'MANA';
        droppedItems.value.push({
          id: Math.random().toString(36).substr(2, 9),
          type: randomItem,
          config: ITEM_TYPES[randomItem],
          position: itemPosition,
          collectAnimation: false
        });
      }
    }
  }
};

const changeCharacter = (data) => {
  if (data.character && PLAYER_CONFIG[data.character]) {
    gameState.value = GAME_STATE.CHOOSE;
    player.value.character = PLAYER_CONFIG[data.character];
  } else if (data.weapon && WEAPON_CONFIG[data.weapon]) {
    gameState.value = GAME_STATE.CHOOSE;
    player.value.weapon = WEAPON_CONFIG[data.weapon];
  }
};

const changeMoving = (data) => {
  if (data.stopMoving) {
    gameState.value = GAME_STATE.CHOOSE;
  } else {
    gameState.value = GAME_STATE.PLAYING;
  }
};

const handleManaRegenerated = () => {
  if (player.value.mana < player.value.maxMana) {
    player.value.mana = Math.min(player.value.maxMana, player.value.mana + 1);
  }
};

const handleKeydown = (e) => {
  if ((gameState.value === GAME_STATE.GAME_OVER || gameState.value === GAME_STATE.VICTORY) && e.key === 'r') {
    restartGame();
    return;
  }

  if (gameState.value === GAME_STATE.CHOOSE) {
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
    case 'f':
      placeBomb();
      break;
  }
};

const handleKeyup = (e) => {
  if (e.key === 'e') {
    executeAttack();
    player.value.hasExecutedSpecial = false;
  }
  player.value.state = 'idle';
};

onMounted(() => {
  loadMap(0);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
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
  <div class="wrapper">
    <main class="main-content">
      <div class="game-container">
        <GameUI
            :player="player"
            :current-map="currentMap"
            :defeated-enemies="defeatedEnemies"
            :enemies="enemies"
            @mana-regenerated="handleManaRegenerated"
        ></GameUI>
        <Camera
          v-if="dungeonMap"
          :player="player"
          :dungeon-map="dungeonMap"
        >
          <template #default="{ getRelativePosition }">
            <div class="dungeon-container">
              <div v-for="(row, rowIndex) in dungeonMap" :key="rowIndex" class="map-row" :class="{ [`row--${rowIndex}`]: true }">
                <Tile
                  v-for="(tile, tileIndex) in row"
                  :key="`${rowIndex}-${tileIndex}`"
                  :tile-position="{ x: tileIndex, y: rowIndex }"
                  :tile="tile"
                  :tile-object="getTileObjects(tile, rowIndex, tileIndex)"
                />
              </div>
              <Player
                  :player="player"
                  :game-state="gameState"
              />
              <Enemy
                  v-for="enemy in enemies"
                  :key="enemy.id"
                  :enemy="enemy"
                  :active-enemies-near-player="activeEnemiesNearPlayer"
              />
              <Item v-for="item in droppedItems" :key="item.id" :item="item" />
              <Explosion
                  v-for="explosion in activeExplosions"
                  :key="explosion.id"
                  :position="explosion.position"
                  :bomb-id="explosion.bombId"
              />
              <template
                  v-if="currentMap.type === 'quest'"
              >
                <NPC
                    v-if="activeQuest"
                    :quests="currentMap.quests"
                    :player="player"
                    :should-reset="gameState === GAME_STATE.GAME_OVER"
                    @start-quest="startQuest"
                    @show-stairs="showStairs"
                    @drop-gift="dropGift"
                    @change-character="changeCharacter"
                    @change-moving="changeMoving"
                />
                <Item
                    v-for="item in questItems.filter(item => item.name === 'item')"
                    :key="`${item.x}-${item.y}`"
                    :item="{
                      position: {x: item.x, y: item.y},
                      name: item.name,
                      type: item.type,
                      config: ITEM_TYPES[item.type],
                      collectAnimation: item.collected
                    }"
                />
              </template>
            </div>
          </template>
        </Camera>
        <Overlay :game-state="gameState" :player="player"></Overlay>
      </div>
    </main>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #000;
  }

  .game-container {
    position: relative;
    overflow: hidden;
    transition: opacity 0.3s;
  }

  .dungeon-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    background: #000;
    image-rendering: pixelated;
    -webkit-font-smoothing: none;
  }

  .map-row {
    display: flex;
  }

  .flip-out {
    opacity: 0;
  }

  .flip-in {
    opacity: 1;
  }
</style>