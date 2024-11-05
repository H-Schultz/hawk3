<script setup>
import {ref, onMounted, onUnmounted, computed, watch} from 'vue';
import { useRouter } from 'vue-router';
import dungeonSprite from '../../assets/dungeon-crawler/dungeon-sprite.png';

const MAPS = [
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 8, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    enemiesRequired: 1,
    name: 'Eingangshalle',
    type: 'normal',
    allowedEnemyTypes: ['GOBLIN']
  },
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 2, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 8, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    enemiesRequired: 1,
    name: "Orghalle",
    type: 'boss',
    bossConfig: {
      type: 'boss',
      name: 'BOSS',
      position: { x: 2, y: 4 },
    }
  },
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 8, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    enemiesRequired: 5,
    name: "Schatzkammer",
    type: 'normal',
    allowedEnemyTypes: ['SKELETON', 'GOBLIN']
  },
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 8, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    enemiesRequired: 4,
    name: "Kerker",
    type: 'normal',
    allowedEnemyTypes: ['SKELETON', 'GOBLIN', 'ORC']
  },
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 2, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 8, 1, 0, 0, 0, 0, 0, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    enemiesRequired: 6,
    name: "Thronsaal",
    type: 'normal',
    allowedEnemyTypes: ['ORC']
  },
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 8, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    enemiesRequired: 1,
    name: "Bosshalle",
    type: 'boss',
    bossConfig: {
      type: 'boss',
      name: 'END_BOSS',
      position: { x: 5, y: 3 },
    }
  }
];

const GAME_STATE = {
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete',
  VICTORY: 'victory'
};
const LEVEL_CONFIG = {
  healthBonus: 0,
};
const SPRITE_SIZE = 16;
const SPRITE_SCALE = 4;
const DISPLAY_SIZE = SPRITE_SIZE * SPRITE_SCALE;
const ANIMATION_SPEED = 150;
const HEART_SPRITES = {
  FULL: {x: DISPLAY_SIZE * 18, y: DISPLAY_SIZE * 23},
  HALF: {x: DISPLAY_SIZE * 19, y: DISPLAY_SIZE * 23},
  EMPTY: {x: DISPLAY_SIZE * 20, y: DISPLAY_SIZE * 23}
};
const MAX_HEALTH = 6;
const playerHealth = ref(MAX_HEALTH);
const isWhirlwindAttacking = ref(false);
const WHIRLWIND_DURATION = 800;
const chargeStartTime = ref(null);
const isCharging = ref(false);
const hasExecutedWhirlwind = ref(false);
const CHARGE_TIME = 2000;
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
const currentMap = ref(null);
const isStairActive = ref(false);
const dungeonMap = ref(null);
const router = useRouter();

function goBack() {
  router.push('/');
}

const ITEM_TYPES = {
  HEART: {
    name: 'heart',
    sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 23},
    size: {width: 16, height: 16},
    frames: 1,
    effect: () => {
      playerHealth.value = Math.min(MAX_HEALTH, playerHealth.value + 2);
    }
  },
  COIN: {
    name: 'coin',
    sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 24},
    size: {width: 8, height: 9},
    frames: 4,
    frameOffset: SPRITE_SIZE / 2, // Offset für die Animation-Frames
    effect: (player) => {
      coins.value++;
    }
  }
};

const ENEMY_TYPES = {
  SKELETON: {
    name: 'skeleton',
    type: 'default',
    maxHealth: 3,
    damage: 1,
    moveSpeed: 2000,
    spriteSize: { x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
    sprites: {
      idle: [
        {x: SPRITE_SIZE * 23, y: SPRITE_SIZE * 5},
        {x: SPRITE_SIZE * 24, y: SPRITE_SIZE * 5},
        {x: SPRITE_SIZE * 25, y: SPRITE_SIZE * 5},
        {x: SPRITE_SIZE * 26, y: SPRITE_SIZE * 5},
      ],
      run: [
        {x: SPRITE_SIZE * 27, y: SPRITE_SIZE * 5},
        {x: SPRITE_SIZE * 28, y: SPRITE_SIZE * 5},
        {x: SPRITE_SIZE * 29, y: SPRITE_SIZE * 5},
        {x: SPRITE_SIZE * 30, y: SPRITE_SIZE * 5},
      ]
    }
  },
  GOBLIN: {
    name: 'goblin',
    type: 'default',
    maxHealth: 2,
    damage: 1,
    moveSpeed: 1500,
    spriteSize: { x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
    sprites: {
      idle: [
        {x: SPRITE_SIZE * 23, y: (SPRITE_SIZE * 9) + 8},
        {x: SPRITE_SIZE * 24, y: (SPRITE_SIZE * 9) + 8},
        {x: SPRITE_SIZE * 25, y: (SPRITE_SIZE * 9) + 8},
        {x: SPRITE_SIZE * 26, y: (SPRITE_SIZE * 9) + 8},
      ],
      run: [
        {x: SPRITE_SIZE * 27, y: (SPRITE_SIZE * 9) + 8},
        {x: SPRITE_SIZE * 28, y: (SPRITE_SIZE * 9) + 8},
        {x: SPRITE_SIZE * 29, y: (SPRITE_SIZE * 9) + 8},
        {x: SPRITE_SIZE * 30, y: (SPRITE_SIZE * 9) + 8},
      ]
    }
  },
  ORC: {
    name: 'orc',
    type: 'default',
    maxHealth: 5,
    damage: 1,
    moveSpeed: 2500,
    spriteSize: { x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
    sprites: {
      idle: [
        {x: SPRITE_SIZE * 23, y: SPRITE_SIZE * 11},
        {x: SPRITE_SIZE * 24, y: SPRITE_SIZE * 11},
        {x: SPRITE_SIZE * 25, y: SPRITE_SIZE * 11},
        {x: SPRITE_SIZE * 26, y: SPRITE_SIZE * 11},
      ],
      run: [
        {x: SPRITE_SIZE * 27, y: SPRITE_SIZE * 11},
        {x: SPRITE_SIZE * 28, y: SPRITE_SIZE * 11},
        {x: SPRITE_SIZE * 29, y: SPRITE_SIZE * 11},
        {x: SPRITE_SIZE * 30, y: SPRITE_SIZE * 11},
      ]
    }
  },
  BOSS: {
    name: 'boss',
    type: 'boss',
    maxHealth: 14,
    damage: 1,
    moveSpeed: 3000,
    spriteSize: { x: SPRITE_SIZE * SPRITE_SCALE * 2, y: SPRITE_SIZE * SPRITE_SCALE * 2},
    sprites: {
      idle: [
        {x: SPRITE_SIZE, y: SPRITE_SIZE * 24},
        {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 24},
        {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 24},
        {x: SPRITE_SIZE * 7, y: SPRITE_SIZE * 24},
      ],
      run: [
        {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 24},
        {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 24},
        {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 24},
        {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 24},
      ]
    }
  },
  END_BOSS: {
    name: 'end_boss',
    type: 'boss',
    maxHealth: 20,
    damage: 2,
    moveSpeed: 3000,
    spriteSize: { x: SPRITE_SIZE * SPRITE_SCALE * 2, y: SPRITE_SIZE * SPRITE_SCALE * 2},
    sprites: {
      idle: [
        {x: SPRITE_SIZE, y: SPRITE_SIZE * 21},
        {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 21},
        {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 21},
        {x: SPRITE_SIZE * 7, y: SPRITE_SIZE * 21},
      ],
      run: [
        {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 21},
        {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 21},
        {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 21},
        {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 21},
      ]
    }
  }
};

// Spawn-Konfiguration
const SPAWN_CONFIG = {
  initialDelay: 1000,
  minInterval: 1000,
  maxInterval: 2000,
  maxEnemies: 5
};
const ENEMY_CONFIG = {
  attackDelay: {
    min: 500,
    max: 3000
  }
};
let nextEnemyId = 1;

const enemies = ref([
  {
    id: nextEnemyId++,
    type: 'default',
    name: 'SKELETON',
    position: { x: 5, y: 2 },
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

const PLAYER_SPRITES = {
  idle: [
    {x: SPRITE_SIZE * 8, y: SPRITE_SIZE * 14},
    {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 14},
    {x: SPRITE_SIZE * 10, y: SPRITE_SIZE * 14},
    {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 14},
  ],
  run: [
    {x: SPRITE_SIZE * 12, y: SPRITE_SIZE * 14},
    {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 14},
    {x: SPRITE_SIZE * 14, y: SPRITE_SIZE * 14},
    {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 14},
  ]
};

const SWORD_SPRITE = { x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 2 };

const tilePositions = {
  0: {x: SPRITE_SIZE, y: SPRITE_SIZE * 4},
  1: {x: SPRITE_SIZE, y: SPRITE_SIZE},
  8: {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 12},
};

const loadMap = (mapIndex) => {
  const mapData = MAPS[mapIndex];
  if (!mapData) return false;

  const layout = mapData.layout;
  let startPos = {x: 1, y: 1};

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === 2) {
        startPos = {x, y};
        break;
      }
    }
  }

  isStairActive.value = false;
  const processedLayout = layout.map(row =>
      row.map(tile => tile === 2 || (tile === 8 && !isStairActive.value) ? 0 : tile)
  );

  currentMapIndex.value = mapIndex;
  currentMap.value = mapData;
  dungeonMap.value = processedLayout;
  playerPosition.value = startPos;
  defeatedEnemies.value = 0;

  enemies.value = [];
  droppedItems.value = [];

  // Boss-Map Behandlung
  if (mapData.type === 'boss' && mapData.bossConfig) {
    const bossConfig = mapData.bossConfig;
    const bossType = ENEMY_TYPES[bossConfig.name];

    const boss = {
      id: nextEnemyId++,
      type: bossConfig.type,
      name: bossConfig.name,
      position: { ...bossConfig.position },
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

const dropItem = (position) => {
  const dropChance = Math.random();
  if (dropChance > 0.3) return; // 30% Chance für einen Drop

  const itemTypes = Object.keys(ITEM_TYPES);
  const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  droppedItems.value.push({
    id: Date.now(),
    type: randomItem,
    position: { ...position },
    collectAnimation: false
  });
};

// Funktion zum Einsammeln von Items
const collectItem = (item) => {
  item.collectAnimation = true;

  // Effekt nach kurzer Animation ausführen
  setTimeout(() => {
    ITEM_TYPES[item.type].effect();
    droppedItems.value = droppedItems.value.filter(i => i.id !== item.id);
  }, 200);
};

const isValidMove = (position) => {
  const {x, y} = position;

  if (!dungeonMap.value[y] ||
      dungeonMap.value[y][x] === undefined ||
      dungeonMap.value[y][x] === 1) {
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

const getHeartSprite = (index) => {
  const currentHealth = playerHealth.value;
  const heartPosition = index * 2;

  if (currentHealth >= heartPosition + 2) {
    return HEART_SPRITES.FULL;
  } else if (currentHealth > heartPosition) {
    return HEART_SPRITES.HALF;
  } else {
    return HEART_SPRITES.EMPTY;
  }
};

const getTileStyle = (tileType) => {
  const position = tilePositions[tileType];
  if (!position) return {};

  return {
    width: `${DISPLAY_SIZE}px`,
    height: `${DISPLAY_SIZE}px`,
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${position.x * 4}px -${position.y * 4}px`,
    backgroundSize: '2048px 2048px',
  };
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
    { x: -1, y: 0 }, // Links
    { x: 1, y: 0 },  // Rechts
    { x: 0, y: -1 }, // Oben
    { x: 0, y: 1 },  // Unten
    { x: -1, y: -1 }, // Diagonal oben links
    { x: 1, y: -1 },  // Diagonal oben rechts
    { x: -1, y: 1 },  // Diagonal unten links
    { x: 1, y: 1 }    // Diagonal unten rechts
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

const getPlayerStyle = () => {
  const sprite = PLAYER_SPRITES[playerState.value][currentFrame.value];
  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    left: `${playerPosition.value.x * DISPLAY_SIZE}px`,
    top: `${playerPosition.value.y * DISPLAY_SIZE}px`,
    transform: playerDirection.value === 'left' ? 'scaleX(-1)' : 'none',
    filter: isUnderAttack.value ? 'brightness(1.5) sepia(1) saturate(1000%) hue-rotate(0deg)' : 'none',
    animation: isAttacking.value ? 'swordSwing 0.4s ease-in-out' : 'none'
  };
};

const getEnemyStyle = (enemy) => {
  const enemyType = ENEMY_TYPES[enemy.name];
  const sprite = enemyType.sprites[enemy.state][enemyFrame.value];
  const healthPercentage = enemy.health / enemy.maxHealth;
  const grayscaleValue = (1 - healthPercentage) * 0.5;

  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${sprite.x * 4}px -${sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    left: `${enemy.position.x * DISPLAY_SIZE}px`,
    top: `${enemy.position.y * DISPLAY_SIZE}px`,
    width: `${enemy.spriteSize.x}px`,
    height: `${enemy.spriteSize.y}px`,
    transform: enemy.direction === 'left' ? 'scaleX(-1)' : 'none',
    opacity: enemy.health > 0 ? 1 : 0,
    filter: `grayscale(${grayscaleValue})
             ${enemy.isUnderAttack ? 'brightness(1.5) sepia(1) saturate(1000%) hue-rotate(0deg)' : ''}
             ${enemy.isPreparingAttack ? 'saturate(2) brightness(1.2)' : ''}
             ${activeEnemiesNearPlayer.value.includes(enemy) ? 'saturate(1.5)' : ''}`
  };
};

const getSwordStyle = () => {
  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${SWORD_SPRITE.x * 4}px -${SWORD_SPRITE.y * 4}px`,
    backgroundSize: '2048px 2048px',
    transform: playerDirection.value === 'left' ? 'scaleX(-1)' : 'none',
    transformOrigin: playerDirection.value === 'left' ? 'calc(100% - 32px) calc(100% - 16px)' : 'calc(100% - 32px) calc(100% - 16px)',
  };
};

// Funktion für Item-Styling
const getItemStyle = (item) => {
  const itemType = ITEM_TYPES[item.type];
  const sprite = itemType.sprite;
  let frameX = sprite.x;
  if (itemType.frames > 1) {
    const currentItemFrame = Math.floor(Date.now() / 150) % itemType.frames;
    frameX += currentItemFrame * itemType.frameOffset;
  }

  return {
    backgroundImage: `url(${dungeonSprite})`,
    backgroundPosition: `-${frameX * 4}px -${sprite.y * 4}px`,
    backgroundSize: '2048px 2048px',
    left: `${item.position.x * DISPLAY_SIZE + (DISPLAY_SIZE - itemType.size.width * 4) / 2}px`,
    top: `${item.position.y * DISPLAY_SIZE + (DISPLAY_SIZE - itemType.size.height * 4) / 2}px`,
    width: `${itemType.size.width * 4}px`,
    height: `${itemType.size.height * 4}px`,
    animation: item.collectAnimation ? 'collectItem 0.2s ease-out' : '',
  };
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

    if (isValidMove({ x: targetX, y: targetY })) {
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
    if (dungeonMap.value[y][x] === 0 && // Kein Wandfeld
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
  if (currentMap.value.type === 'boss') {
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
  if (ENEMY_TYPES[enemy.name].type === 'boss') {
    updateBossAttackPattern(enemy);
  }
  let movePatterns = [
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: -1},
    {dx: 0, dy: 1}
  ];

  const dx = playerPosition.value.x - enemy.position.x;
  const dy = playerPosition.value.y - enemy.position.y;
  const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

  if (distanceToPlayer < 4) {
    if (dx > 0) movePatterns.push({dx: 1, dy: 0});
    if (dx < 0) movePatterns.push({dx: -1, dy: 0});
    if (dy > 0) movePatterns.push({dx: 0, dy: 1});
    if (dy < 0) movePatterns.push({dx: 0, dy: -1});
  }

  const randomMove = movePatterns[Math.floor(Math.random() * movePatterns.length)];
  const newPosition = {
    x: enemy.position.x + randomMove.dx,
    y: enemy.position.y + randomMove.dy
  };

  if (randomMove.dx !== 0) {
    enemy.direction = randomMove.dx > 0 ? 'right' : 'left';
  }

  if (dungeonMap.value[newPosition.y] &&
      dungeonMap.value[newPosition.y][newPosition.x] !== undefined &&
      dungeonMap.value[newPosition.y][newPosition.x] !== 1 &&
      !isSamePosition(newPosition, playerPosition.value) &&
      !enemies.value.some(otherEnemy =>
          otherEnemy !== enemy &&
          otherEnemy.health > 0 &&
          isSamePosition(newPosition, otherEnemy.position)
      )) {
    enemy.position = newPosition;
    enemy.state = 'run';

    setTimeout(() => {
      enemy.state = 'idle';
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

const enemyAttack = (enemy) => {
  if (!enemy.canAttack || enemy.health <= 0 || enemy.isPreparingAttack || gameState.value !== GAME_STATE.PLAYING) return;

  enemy.canAttack = false;
  enemy.isPreparingAttack = true;

  const attackDelay = Math.random() *
      (ENEMY_CONFIG.attackDelay.max - ENEMY_CONFIG.attackDelay.min) +
      ENEMY_CONFIG.attackDelay.min;

  setTimeout(() => {
    if (enemy.health <= 0) return;
    const dx = Math.abs(playerPosition.value.x - enemy.position.x);
    const dy = Math.abs(playerPosition.value.y - enemy.position.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      isUnderAttack.value = true;
      playerHealth.value -= ENEMY_TYPES[enemy.name].damage;

      // Prüfe Game Over
      if (playerHealth.value <= 0) {
        gameState.value = GAME_STATE.GAME_OVER;
        playerHealth.value = 0;
      }

      setTimeout(() => {
        isUnderAttack.value = false;
      }, 200);
    }

    enemy.isPreparingAttack = false;

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
    // Prüfe ob Spieler die Treppe erreicht hat
    if (dungeonMap.value[newPosition.y][newPosition.x] === 8) {
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
      if (layout[y][x] === 8) {
        dungeonMap.value[y][x] = 8;
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
            <span>{{ currentMap?.name }}</span>
            <span v-if="currentMap?.type !== 'boss'">
          Enemies: {{ defeatedEnemies }}/{{ currentMap?.enemiesRequired }}
        </span>
            <span v-else>
          Boss Health: {{ enemies[0]?.health }}/{{ enemies[0]?.maxHealth }}
        </span>
          </div>
          <div class="coins-container">
            <div class="coin-icon" :style="{
          backgroundImage: `url(${dungeonSprite})`,
          backgroundPosition: `-${ITEM_TYPES.COIN.sprite.x * 4}px -${ITEM_TYPES.COIN.sprite.y * 4}px`,
        }"/>
            <span class="coin-count">{{ coins }}</span>
          </div>
        </div>

        <!-- Victory Overlay -->
        <div v-if="gameState === GAME_STATE.VICTORY" class="victory-overlay">
          <div class="victory-content">
            <h2>You Win!</h2>
            <p>Congratulations!</p>
            <p>Münzen gesammelt: {{ coins }}</p>
            <p>Drücke 'R' zum Neustarten</p>
          </div>
        </div>

        <!-- Game Over Overlay -->
        <div v-if="gameState === GAME_STATE.GAME_OVER" class="game-over-overlay">
          <div class="game-over-content">
            <h2>Game Over</h2>
            <p>Münzen gesammelt: {{ coins }}</p>
            <p>Drücke 'R' zum Neustarten</p>
          </div>
        </div>
        <div class="dungeon-container">
          <div
              v-for="(row, rowIndex) in dungeonMap"
              :key="rowIndex"
              class="map-row"
          >
            <div
                v-for="(tile, tileIndex) in row"
                :key="`${rowIndex}-${tileIndex}`"
                class="tile"
                :style="getTileStyle(tile)"
            />
          </div>
          <div
              class="player"
              :class="{
            'attacking': isAttacking,
            'charging ': isCharging,
            'whirlwindAttacking': isWhirlwindAttacking,
          }" :style="getPlayerStyle()">
            <div class="sword" :style="getSwordStyle()"/>
          </div>

          <div
              v-for="enemy in enemies"
              :key="enemy.id"
              class="enemy"
              :class="{
          [`enemy--${enemy.direction}-direction`]: true,
          [`enemy--${enemy.type.toLowerCase()}`]: true
        }"
              :style="getEnemyStyle(enemy)"
          >
            <div v-if="enemy.health > 0" class="enemy-health">
              <div
                  class="health-bar"
                  :style="{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }"
              />
            </div>
          </div>
          <div
              v-for="item in droppedItems"
              :key="item.id"
              class="item"
              :class="[item.type.toLowerCase(), { collecting: item.collectAnimation }]"
              :style="getItemStyle(item)"
          />
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

.tile {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
}

.player,
.enemy {
  position: absolute;
  width: 64px;
  height: 128px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  transition: left 0.1s ease, top 0.1s ease, filter 0.2s ease;
}

.player {
  margin-top: -72px;
  z-index: 103;
  transform-origin: center;
}

.enemy {
  width: 64px;
  height: 96px;
  margin-top: -48px;
  z-index: 102;
}

.sword {
  position: absolute;
  width: 64px;
  height: 128px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  right: 0;
  top: 0;
  transition: transform 0.1s ease, opacity 0.1s ease;
  opacity: 0;
}

.hearts-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 0;
  z-index: 10;
}

.heart {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-size: 2048px 2048px;
}

.health-bar {
  height: 100%;
  background: #ff0000;
  transition: width 0.3s ease;
}

.enemy--boss {
  width: 128px;
  height: 128px;
  margin-top: -74px;
  margin-left: -32px;
}

.enemy-health {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 8px;
  background: #444;
  border: 1px solid #000;
  z-index: 104;
}

.enemy--left-direction .enemy-health {
  transform: scaleX(-1) translateX(50%);
}

.health-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.enemy--boss .enemy-health {
  width: 80px;
  height: 12px;
  top: 0;
}

.coins-container {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
}

.coin-icon {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-size: 2048px 2048px;
}

.coin-count {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.item {
  position: absolute;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  transition: margin-top 0.2s ease;
  z-index: 101;
  animation: itemFloat 2s ease-in-out infinite;
}

.item.collecting {
  transform: scale(1.5);
  opacity: 0;
}

@keyframes itemFloat {
  0%, 100% {
    margin-top: 0;
  }
  50% {
    margin-top: -8px;
  }
}

@keyframes collectHeart {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.5;
  }
  100% {
    transform: scale(2) rotate(360deg);
    opacity: 0;
  }
}

@keyframes collectCoin {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-20px);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.5) translateY(-40px);
    opacity: 0;
  }
}

/* Item-spezifische Klassen */
.item.heart.collecting {
  animation: collectHeart 0.3s ease-out forwards;
}

.item.coin.collecting {
  animation: collectCoin 0.4s ease-out forwards;
}

.game-ui {
  position: relative;
  z-index: 105;
  padding: 10px;
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

.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.game-over-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  color: #000;
}

.game-over-content h2 {
  font-size: 32px;
  color: #ff0000;
  margin: 0 0 20px;
}

.game-over-content p {
  font-size: 18px;
  margin: 10px 0;
}

.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.victory-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  animation: victoryPulse 2s infinite;
  color: #000;
}

.victory-content h2 {
  font-size: 48px;
  color: #ffd700;
  margin: 0 0 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes victoryPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.player.attacking .sword {
  animation: swordSwing 0.4s ease-in-out;
}

.player.charging .sword {
  animation: swordChargeWhirlwind 2s ease-in-out;
}

.player.chargingWhirlwind .sword {
  animation: swordChargeWhirlwind 2s ease-in-out;
}

.player.whirlwindAttacking .sword {
  animation: swordWhirlwind 0.8s linear;
}

@keyframes swordChargeWhirlwind {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: translateY(-32px) rotate(-10deg);
  }
}

@keyframes swordWhirlwind {
  0% {
    opacity: 1;
    transform: translateY(-32px) rotate(-10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(720deg);
  }
}

@keyframes swordSwing {
  10% {
    opacity: 1;
    transform: rotate(-10deg);
  }
  30% {
    transform: rotate(90deg);
  }
  70% {
    opacity: 1;
    transform: rotate(10deg);
  }
  100% {
    opacity: 0;
  }
}

</style>