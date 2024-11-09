export const GAME_STATE = {
    PLAYING: 'playing',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete',
    VICTORY: 'victory'
};
export const MAPS = [
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
        name: 'Orghalle',
        type: 'boss',
        bossConfig: {
            type: 'boss',
            name: 'BOSS',
            position: {x: 2, y: 4},
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
        name: 'Schatzkammer',
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
        name: 'Kerker',
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
        name: 'Thronsaal',
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
        name: 'Bosshalle',
        type: 'boss',
        bossConfig: {
            type: 'boss',
            name: 'END_BOSS',
            position: {x: 5, y: 3},
        }
    }
];

export const LEVEL_CONFIG = {
    healthBonus: 0,
};

export const SPRITE_SIZE = 16;
export const SPRITE_SCALE = 4;
export const DISPLAY_SIZE = SPRITE_SIZE * SPRITE_SCALE;
export const ANIMATION_SPEED = 150;
export const HEART_SPRITES = {
    FULL: {x: DISPLAY_SIZE * 18, y: DISPLAY_SIZE * 23},
    HALF: {x: DISPLAY_SIZE * 19, y: DISPLAY_SIZE * 23},
    EMPTY: {x: DISPLAY_SIZE * 20, y: DISPLAY_SIZE * 23}
};
export const MAX_HEALTH = 6;
export const WHIRLWIND_DURATION = 800;
export const CHARGE_TIME = 2000;

export const ITEM_TYPES = {
    HEART: {
        name: 'heart',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 23},
        size: {width: 16, height: 16},
        frames: 1
    },
    COIN: {
        name: 'coin',
        sprite: {
            x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 24
        },
        size: {width: 8, height: 9},
        frames: 4,
        frameOffset: SPRITE_SIZE / 2,
    }
};

export const ENEMY_TYPES = {
    SKELETON: {
        name: 'skeleton',
        type: 'default',
        maxHealth: 3,
        damage: 1,
        moveSpeed: 2000,
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
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
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
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
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
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
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE * 2, y: SPRITE_SIZE * SPRITE_SCALE * 2},
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
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE * 2, y: SPRITE_SIZE * SPRITE_SCALE * 2},
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
export const SPAWN_CONFIG = {
    initialDelay: 1000,
    minInterval: 1000,
    maxInterval: 2000,
    maxEnemies: 5
};
export const ENEMY_CONFIG = {
    attackDelay: {
        min: 500,
        max: 3000
    }
};

export const PLAYER_SPRITES = {
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

export const SWORD_SPRITE = {x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 2};

export const TILES = {
    0: {x: SPRITE_SIZE, y: SPRITE_SIZE * 4},
    1: {x: SPRITE_SIZE, y: SPRITE_SIZE},
    8: {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 12},
};