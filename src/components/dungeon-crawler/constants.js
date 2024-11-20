export const GAME_STATE = {
    PLAYING: 'playing',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete',
    VICTORY: 'victory'
};

export const SPRITE_SIZE = 16;
export const SPRITE_SCALE = 4;
export const DISPLAY_SIZE = SPRITE_SIZE * SPRITE_SCALE;
export const ANIMATION_SPEED = 150;
export const MAX_HEALTH = 6;
export const MAX_MANA = 6;
export const WHIRLWIND_DURATION = 800;
export const CHARGE_TIME = 2000;

export const TILES = {
    10: {x: SPRITE_SIZE, y: SPRITE_SIZE, zIndex: 2}, // Mauer Rechts
    11: {x: SPRITE_SIZE * 2, y: SPRITE_SIZE, zIndex: 0}, // Mauer Oben/Unten
    12: {x: SPRITE_SIZE * 3, y: SPRITE_SIZE, zIndex: 0}, // Mauer Links
    14: {x: SPRITE_SIZE * 2, y: 0, zIndex: 1}, // Schmale Mauer Oben
    15: {x: SPRITE_SIZE * 4, y: 0, zIndex: 1}, // Schmale Mauer Oben Verziert
    17: {x: SPRITE_SIZE * 4, y: SPRITE_SIZE, zIndex: 1, frames: 3, frameOffset: SPRITE_SIZE}, // rote Tränke Mitte
    18: {x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 3, zIndex: 1, frames: 3, frameOffset: SPRITE_SIZE}, // blaue Tränke Mitte
    19: {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 3, zIndex: 1}, // Brüchige zerstöbare Mauer
    20: {x: SPRITE_SIZE, y: SPRITE_SIZE * 4, zIndex: 0}, // Boden blank
    21: {x: SPRITE_SIZE * 2, y: SPRITE_SIZE * 5}, // Boden mit wenig Rissen
    22: {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 4}, // Boden mit wenig Rissen
    23: {x: SPRITE_SIZE * 2, y: SPRITE_SIZE * 4}, // Boden mit vielen Rissen
    24: {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 5}, // Boden mit vielen Rissen
    25: {x: SPRITE_SIZE, y: SPRITE_SIZE * 5}, // Boden mit vielen Rissen
    30: {
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 12},
                {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 12},
                {x: SPRITE_SIZE * 2, y: SPRITE_SIZE * 12},
                {x: SPRITE_SIZE, y: SPRITE_SIZE * 12},
            ],
            active: [
                {x: SPRITE_SIZE, y: SPRITE_SIZE * 12},
                {x: SPRITE_SIZE * 2, y: SPRITE_SIZE * 12},
                {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 12},
                {x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 12},
            ],
        },
        x: SPRITE_SIZE,
        y: SPRITE_SIZE * 12,
        trap: {
            damage: 1,
            activationInterval: 3000,
            activeTime: 1000,
            activeSprite: {
                x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 12
            }
        }}, // Falle
    40: {x: SPRITE_SIZE, y: SPRITE_SIZE * 4, layer: 14, zIndex: 2}, // Tränke Oben
    41: {x: SPRITE_SIZE, y: SPRITE_SIZE * 4, layer: 15, zIndex: 2}, // Tränke Oben Verziert
    71: {x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 2, frames: 3, frameOffset: SPRITE_SIZE}, // rote Tränke Boden
    72: {x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 4, frames: 3, frameOffset: SPRITE_SIZE}, // blaue Tränke Boden
    98: {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 12}, // Treppe
    99: {x: SPRITE_SIZE, y: SPRITE_SIZE * 4}, // NPC Platzhalter
};
export const MAPS = [
    {
        layout: [
            [ 0, 14, 14, 14, 14, 15, 14, 14, 14, 14, 14, 0],
            [ 0, 12, 11, 11, 11, 17, 11, 11, 11, 11, 11, 0],
            [ 0, 12, 20, 20, 21, 71, 23, 20, 20, 20, 10, 0],
            [ 0, 12, 90, 20, 20, 20, 22, 20, 21, 20, 10, 0],
            [ 0, 12, 98, 22, 20, 20, 20, 20, 20, 21, 10, 0],
            [ 0, 12, 21, 20, 21, 22, 20, 20, 30, 23, 10, 0],
            [ 0, 12, 25, 20, 22, 21, 22, 10, 11, 11, 11, 0],
            [ 0, 12, 20, 40, 41, 40, 20, 19, 20, 20, 10, 0],
            [ 0, 12, 20, 10, 18, 12, 20, 19, 20, 20, 10, 0],
            [ 0, 12, 20, 20, 72, 20, 20, 19, 20, 20, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 40, 19, 40, 40, 10, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        name: 'Verlassener Eingang',
        type: 'quest',
        allowedEnemyTypes: ['GOBLIN'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION', 'BOMB'],
        maxEnemies: 2,
        quests: [
            {
                npc: {x: 4, y: 2},
                description: [
                    'Willkommen mutiger Held!',
                    'Der alte Dungeon wurde von dunklen Mächten überrannt.',
                    'Wir brauchen deine Hilfe, um das alte Heiligtum zurückzuerobern.',
                    'Aber sei vorsichtig, mit jedem Level werden die Gegner stärker.',
                    'Sammle zunächst diese Ausrüstung für deine Reise.'
                ],
                goal: 3,
                type: 'RED_POTION',
                successMessage: 'Ausgezeichnet! Du bist bereit für deine Mission.',
                spots: [
                    {x: 5, y: 5, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 8, y: 4, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 6, y: 3, collected: false, name: 'item', type: 'RED_POTION'}
                ]
            }
        ]
    }, {
        layout: [
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10],
            [12, 90, 20, 21, 20, 20, 23, 20, 21, 20, 22, 20, 20, 10],
            [12, 20, 30, 20, 19, 20, 20, 19, 20, 30, 20, 19, 20, 10],
            [12, 21, 20, 19, 20, 30, 20, 20, 19, 20, 19, 20, 23, 10],
            [12, 20, 19, 20, 23, 20, 21, 19, 20, 20, 20, 30, 20, 10],
            [12, 23, 20, 30, 20, 20, 20, 20, 30, 19, 20, 20, 98, 10],
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10]
        ],
        name: 'Goblin Höhlen',
        type: 'combat',
        allowedEnemyTypes: ['GOBLIN'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION', 'BOMB'],
        maxEnemies: 4,
        enemiesRequired: 8
    },{
        layout: [
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 10],
            [12, 90, 20, 21, 30, 20, 21, 20, 20, 10],
            [12, 20, 19, 20, 20, 19, 20, 19, 20, 10],
            [12, 21, 20, 30, 20, 20, 30, 20, 21, 10],
            [12, 20, 19, 20, 21, 19, 20, 19, 20, 10],
            [12, 22, 20, 30, 20, 20, 30, 20, 22, 10],
            [12, 20, 19, 20, 19, 19, 20, 19, 20, 10],
            [12, 21, 20, 21, 20, 20, 21, 98, 23, 10],
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 10]
        ],
        name: 'Skelett Krypta',
        type: 'combat',
        allowedEnemyTypes: ['SKELETON'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION'],
        maxEnemies: 5,
        enemiesRequired: 10
    },
    // Level 4: Schatzsuche
    {
        layout: [
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10],
            [12, 90, 20, 19, 20, 21, 20, 19, 20, 20, 20, 10],
            [12, 20, 19, 20, 19, 20, 19, 20, 19, 20, 23, 10],
            [12, 21, 20, 30, 20, 30, 20, 30, 20, 19, 20, 10],
            [12, 20, 19, 20, 19, 20, 19, 20, 19, 20, 21, 10],
            [12, 23, 20, 30, 20, 30, 20, 30, 20, 19, 20, 10],
            [12, 20, 19, 20, 19, 20, 19, 20, 19, 20, 98, 10],
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10]
        ],
        name: 'Verlorene Schatzkammer',
        type: 'quest',
        allowedEnemyTypes: ['SKELETON', 'GOBLIN'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION', 'COIN'],
        maxEnemies: 3,
        quests: [
            {
                npc: {x: 5, y: 3},
                description: [
                    'In dieser Kammer liegen die alten Schätze des Dungeons.',
                    'Sammle 10 Münzen, aber pass auf die Wächter auf!',
                    'Die Münzen werden uns helfen, den Dungeon wieder aufzubauen.'
                ],
                goal: 10,
                type: 'COIN',
                successMessage: 'Hervorragend! Diese Schätze werden uns sehr helfen!',
                spots: [
                    {x: 3, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 5, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 7, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 3, y: 4, collected: false, name: 'item', type: 'COIN'},
                    {x: 5, y: 4, collected: false, name: 'item', type: 'COIN'},
                    {x: 7, y: 4, collected: false, name: 'item', type: 'COIN'},
                    {x: 3, y: 6, collected: false, name: 'item', type: 'COIN'},
                    {x: 5, y: 6, collected: false, name: 'item', type: 'COIN'},
                    {x: 7, y: 6, collected: false, name: 'item', type: 'COIN'},
                    {x: 9, y: 4, collected: false, name: 'item', type: 'COIN'},
                    {x: 4, y: 3, collected: false, name: 'enemy', type: 'SKELETON'},
                    {x: 6, y: 5, collected: false, name: 'enemy', type: 'GOBLIN'}
                ]
            }
        ]
    },
    // Level 5: Ork Festung
    {
        layout: [
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10],
            [12, 90, 20, 21, 20, 30, 20, 30, 20, 21, 20, 20, 20, 10],
            [12, 20, 19, 20, 19, 20, 19, 20, 19, 20, 19, 20, 23, 10],
            [12, 21, 20, 30, 20, 30, 20, 30, 20, 30, 20, 19, 20, 10],
            [12, 20, 19, 20, 19, 20, 19, 20, 19, 20, 19, 20, 21, 10],
            [12, 23, 20, 30, 20, 30, 20, 30, 20, 30, 20, 19, 20, 10],
            [12, 20, 19, 20, 19, 20, 19, 20, 19, 20, 19, 20, 98, 10],
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10]
        ],
        name: 'Ork Festung',
        type: 'combat',
        allowedEnemyTypes: ['ORC'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION', 'BOMB'],
        maxEnemies: 4,
        enemiesRequired: 6
    },
    // Level 6: Fallenhalle
    {
        layout: [
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10],
            [12, 90, 20, 30, 20, 21, 20, 30, 20, 20, 10],
            [12, 20, 30, 20, 30, 20, 30, 20, 30, 20, 10],
            [12, 30, 20, 30, 20, 30, 20, 30, 20, 30, 10],
            [12, 20, 30, 20, 30, 20, 30, 20, 30, 20, 10],
            [12, 30, 20, 30, 20, 30, 20, 30, 20, 98, 10],
            [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10]
        ],
        name: 'Fallenhalle',
        type: 'quest',
        allowedEnemyTypes: ['SKELETON', 'ORC'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION'],
        maxEnemies: 2,
        quests: [
            {
                npc: {x: 2, y: 2},
                description: [
                    'Diese Halle ist voller tödlicher Fallen!',
                    'Finde einen sicheren Weg durch die Fallen.',
                    'Sammle die heiligen Schlüssel, um weiterzukommen.'
                ],
                goal: 4,
                type: 'COIN',
                successMessage: 'Du hast es geschafft! Der Weg zum Endgegner ist nun frei!',
                spots: [
                    {x: 4, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 7, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 4, y: 4, collected: false, name: 'item', type: 'COIN'},
                    {x: 7, y: 4, collected: false, name: 'item', type: 'COIN'}
                ]
            }
        ]
    },
    /*
    {
        layout: [
            [ 0, 14, 14, 14, 14, 15, 14, 14, 14, 14, 14, 0],
            [ 0, 12, 11, 11, 11, 17, 11, 11, 11, 11, 11, 0],
            [ 0, 12, 20, 20, 21, 71, 23, 20, 20, 20, 10, 0],
            [ 0, 12, 90, 20, 20, 20, 22, 20, 21, 20, 10, 0],
            [ 0, 12, 98, 22, 20, 20, 20, 20, 20, 21, 10, 0],
            [ 0, 12, 21, 20, 21, 22, 20, 20, 30, 23, 10, 0],
            [ 0, 12, 25, 20, 22, 21, 22, 10, 11, 11, 11, 0],
            [ 0, 12, 20, 40, 41, 40, 20, 19, 20, 20, 10, 0],
            [ 0, 12, 20, 10, 18, 12, 20, 19, 20, 20, 10, 0],
            [ 0, 12, 20, 20, 72, 20, 20, 19, 20, 20, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 40, 19, 40, 40, 10, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0]
        ],
        completed: false,
        name: 'Vorhalle',
        allowedEnemyTypes: ['GOBLIN'],
        allowedItems: ['HEART', 'MANA', 'RED_POTION', 'BLUE_POTION', 'BOMB'],
        maxEnemies: 0,
        type: 'quest',
        quests: [
            {
                npc: {x: 4, y: 2},
                description: [
                    'Hallo! Ich erkläre dir kurz das Spiel!',
                    'Du kannst dich mit den Pfeiltasten bewegen.',
                    'Du kannst mit der Taste E kämpfen. Drückst du die Taste kurz, machst du einen kurzen Schlag.',
                    'Du trifft nur das Feld vor dir.',
                    'Drückst du die Taste länger, machst du einen starken rundum Schlag.',
                    'Du triffst alle Felder um dich herum.',
                    'Du verlierst dabei aber Mana.',
                    'Mana kannst du durch blaue Tränke wieder auffüllen.',
                    'Aber alle 10 Sekunden füllt sich dein Mana automatisch um ein Mana auf.',
                    'Versuche es einmal und sammel dabei 3 blauen Tränke ein!',
                ],
                goal: 3,
                type: 'BLUE_POTION',
                successMessage: 'Gut gemacht!',
                spots: [
                    {x: 5, y: 5, collected: false, name: 'item', type: 'BLUE_POTION'},
                    {x: 6, y: 3, collected: false, name: 'item', type: 'BLUE_POTION'},
                    {x: 8, y: 4, collected: false, name: 'item', type: 'BLUE_POTION'},
                ]
            }, {
                npc: {x: 4, y: 2},
                description: [
                    'Feinde können dir auch Schaden zufügen.',
                    'Du kannst Leben durch rote Tränke wieder auffüllen.',
                    'Töte die Feind und ...',
                    'Sammel 3 rote Tränke ein!',
                ],
                goal: 5,
                type: 'RED_POTION',
                successMessage: 'Gut gemacht!',
                spots: [
                    {x: 8, y: 3, collected: false, name: 'enemy', type: 'SKELETON'},
                    {x: 5, y: 5, collected: false, name: 'enemy', type: 'SKELETON'},
                    {x: 6, y: 3, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 7, y: 2, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 6, y: 4, collected: false, name: 'item', type: 'RED_POTION'},
                ]
            }, {
                npc: {x: 4, y: 2},
                description: [
                    'Bomben können dir helfen, Feinde zu besiegen.',
                    'Aber du kannst auch brüchige Mauern damit zerstören.',
                    'Legst du eine Bombe, kannst du davon auch Schaden bekommen.',
                    'Bombem kannst du aber auch zerstörem wenn du auf sie schlägst.',
                    'Sammel 3 Bomben'
                ],
                goal: 3,
                type: 'BOMB',
                successMessage: 'Gut gemacht!',
                spots: [
                    {x: 8, y: 3, collected: false, name: 'item', type: 'BOMB'},
                    {x: 5, y: 5, collected: false, name: 'item', type: 'BOMB'},
                    {x: 6, y: 3, collected: false, name: 'item', type: 'BOMB'},
                ]
            }, {
                npc: {x: 4, y: 2},
                description: [
                    'Achtung es gibt auch Fallen!',
                    'Diese können dir Schaden zufügen.',
                    'Es gibt auch Items die du nicht einsammel solltest.',
                    'Du kannst sie aber auch zerstören.',
                    'Teste beides einmal',
                    'Sammel 3 Tränke ein!',
                ],
                goal: 3,
                type: 'GREEN_POISON',
                successMessage: 'Gut gemacht! Die Treppe ist jetzt frei!',
                spots: [
                    {x: 8, y: 3, collected: false, name: 'item', type: 'GREEN_POISON'},
                    {x: 5, y: 5, collected: false, name: 'item', type: 'GREEN_POISON'},
                    {x: 6, y: 3, collected: false, name: 'item', type: 'GREEN_POISON'},
                    {x: 9, y: 3, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 6, y: 5, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 7, y: 3, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 3, y: 4, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 4, y: 4, collected: false, name: 'item', type: 'RED_POTION'},
                ]
            }
        ]
    }, {
        layout: [
            [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [10, 90, 30, 21, 22, 20, 30, 20, 20, 10],
            [10, 30, 22, 20, 23, 30, 10, 10, 20, 10],
            [10, 20, 10, 30, 20, 23, 10, 20, 20, 10],
            [10, 20, 30, 23, 30, 20, 30, 20, 10, 10],
            [10, 23, 20, 20, 22, 30, 10, 22, 98, 10],
            [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        ],
        enemiesRequired: 1,
        name: 'Bosshalle',
        type: 'boss',
        allowedItems: [],
        bossConfig: {
            type: 'boss',
            name: 'END_BOSS',
            position: {x: 5, y: 3},
        }
    }

     */
];

export const LEVEL_CONFIG = {
    healthBonus: 0,
};

export const ITEM_TYPES = {
    HEART: {
        name: 'heart',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 21},
        size: {width: 16, height: 16},
        frames: 1
    },
    MANA: {
        name: 'mana',
        sprite: {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 21},
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
    },
    RED_POTION: {
        name: 'redPotion',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 22},
        size: {width: 16, height: 16},
        frames: 1
    },
    BLUE_POTION: {
        name: 'bluePotion',
        sprite: {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 22},
        size: {width: 16, height: 16},
        frames: 1
    },
    GREEN_POISON: {
        name: 'greenPoison',
        sprite: {x: SPRITE_SIZE * 20, y: SPRITE_SIZE * 21},
        size: {width: 16, height: 16},
        frames: 1,
        damage: 1,
        destroyable: true
    },
    BOMB: {
        name: 'bomb',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 20},
        size: {width: 16, height: 16},
        frames: 1,
        destroyable: true
    },
    BOMB_BURN: {
        name: 'bombBurn',
        sprite: {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 20},
        size: {width: 16, height: 16},
        frames: 2,
        frameOffset: SPRITE_SIZE,
        destroyable: true
    }
};

export const ENEMY_TYPES = {
    SKELETON: {
        name: 'skeleton',
        type: 'default',
        maxHealth: 3,
        damage: 1,
        intelligence: 0.2,
        dropChance: 0.5,
        moveSpeed: 2000,
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 23, y: SPRITE_SIZE * 5},
                {x: SPRITE_SIZE * 24, y: SPRITE_SIZE * 5},
                {x: SPRITE_SIZE * 25, y: SPRITE_SIZE * 5},
                {x: SPRITE_SIZE * 26, y: SPRITE_SIZE * 5},
            ],
            attack: [
                {x: SPRITE_SIZE * 27, y: SPRITE_SIZE * 5},
                {x: SPRITE_SIZE * 28, y: SPRITE_SIZE * 5},
                {x: SPRITE_SIZE * 29, y: SPRITE_SIZE * 5},
                {x: SPRITE_SIZE * 30, y: SPRITE_SIZE * 5},
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
        intelligence: 0.5,
        dropChance: 0.99,
        moveSpeed: 1000,
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 23, y: (SPRITE_SIZE * 9) + 8},
                {x: SPRITE_SIZE * 24, y: (SPRITE_SIZE * 9) + 8},
                {x: SPRITE_SIZE * 25, y: (SPRITE_SIZE * 9) + 8},
                {x: SPRITE_SIZE * 26, y: (SPRITE_SIZE * 9) + 8},
            ],
            attack: [
                {x: SPRITE_SIZE * 27, y: (SPRITE_SIZE * 9) + 8},
                {x: SPRITE_SIZE * 28, y: (SPRITE_SIZE * 9) + 8},
                {x: SPRITE_SIZE * 29, y: (SPRITE_SIZE * 9) + 8},
                {x: SPRITE_SIZE * 30, y: (SPRITE_SIZE * 9) + 8},
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
        intelligence: 0.8,
        dropChance: 0.5,
        moveSpeed: 2500,
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE, y: (SPRITE_SIZE * SPRITE_SCALE * 2) - (SPRITE_SIZE / 2)},
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 23, y: SPRITE_SIZE * 11},
                {x: SPRITE_SIZE * 24, y: SPRITE_SIZE * 11},
                {x: SPRITE_SIZE * 25, y: SPRITE_SIZE * 11},
                {x: SPRITE_SIZE * 26, y: SPRITE_SIZE * 11},
            ],
            attack: [
                {x: SPRITE_SIZE * 27, y: SPRITE_SIZE * 11},
                {x: SPRITE_SIZE * 28, y: SPRITE_SIZE * 11},
                {x: SPRITE_SIZE * 29, y: SPRITE_SIZE * 11},
                {x: SPRITE_SIZE * 30, y: SPRITE_SIZE * 11},
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
        intelligence: 1,
        dropChance: 1,
        moveSpeed: 2000,
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE * 2, y: SPRITE_SIZE * SPRITE_SCALE * 2},
        sprites: {
            idle: [
                {x: SPRITE_SIZE, y: SPRITE_SIZE * 24},
                {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 24},
                {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 24},
                {x: SPRITE_SIZE * 7, y: SPRITE_SIZE * 24},
            ],
            attack: [
                {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 24},
                {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 24},
                {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 24},
                {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 24},
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
        intelligence: 1,
        dropChance: 1,
        moveSpeed: 2000,
        spriteSize: {x: SPRITE_SIZE * SPRITE_SCALE * 2, y: SPRITE_SIZE * SPRITE_SCALE * 2},
        sprites: {
            idle: [
                {x: SPRITE_SIZE, y: SPRITE_SIZE * 21},
                {x: SPRITE_SIZE * 3, y: SPRITE_SIZE * 21},
                {x: SPRITE_SIZE * 5, y: SPRITE_SIZE * 21},
                {x: SPRITE_SIZE * 7, y: SPRITE_SIZE * 21},
            ],
            attack: [
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

export const NPC_SPRITES = {
    idle: [
        {x: SPRITE_SIZE * 8, y: SPRITE_SIZE * 8},
        {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 8},
        {x: SPRITE_SIZE * 10, y: SPRITE_SIZE * 8},
        {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 8},
    ],
    run: [
        {x: SPRITE_SIZE * 12, y: SPRITE_SIZE * 14},
        {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 14},
        {x: SPRITE_SIZE * 14, y: SPRITE_SIZE * 14},
        {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 14},
    ]
};

export const PLAYER_CONFIG = {
    DINO: {
        sprites: {
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
        }
    },
    KNIGHT: {
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 8, y: SPRITE_SIZE * 6},
                {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 6},
                {x: SPRITE_SIZE * 10, y: SPRITE_SIZE * 6},
                {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 6},
            ],
            run: [
                {x: SPRITE_SIZE * 12, y: SPRITE_SIZE * 6},
                {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 6},
                {x: SPRITE_SIZE * 14, y: SPRITE_SIZE * 6},
                {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 6},
            ]
        }
    },
    HUNTER_MAN: {
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 8, y: SPRITE_SIZE * 2},
                {x: SPRITE_SIZE * 9, y: SPRITE_SIZE * 2},
                {x: SPRITE_SIZE * 10, y: SPRITE_SIZE * 2},
                {x: SPRITE_SIZE * 11, y: SPRITE_SIZE * 2},
            ],
            run: [
                {x: SPRITE_SIZE * 12, y: SPRITE_SIZE * 2},
                {x: SPRITE_SIZE * 13, y: SPRITE_SIZE * 2},
                {x: SPRITE_SIZE * 14, y: SPRITE_SIZE * 2},
                {x: SPRITE_SIZE * 15, y: SPRITE_SIZE * 2},
            ]
        }
    },
    HUNTER_WOMAN: {
        sprites: {
            idle: [
                {x: SPRITE_SIZE * 8, y: 0},
                {x: SPRITE_SIZE * 9, y: 0},
                {x: SPRITE_SIZE * 10, y: 0},
                {x: SPRITE_SIZE * 11, y: 0},
            ],
            run: [
                {x: SPRITE_SIZE * 12, y: 0},
                {x: SPRITE_SIZE * 13, y: 0},
                {x: SPRITE_SIZE * 14, y: 0},
                {x: SPRITE_SIZE * 15, y: 0},
            ]
        }
    }
};

export const WEAPON_CONFIG = {
    MACE: {
        damage: 1,
        sprite: {
            x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 2
        },
        size: {width: 16, height: 32},
    },
    SWORD: {
        damage: 1,
        sprite: {
            x: SPRITE_SIZE * 21, y: 0
        },
        size: {width: 16, height: 32},
    },
    AXE: {
        damage: 2,
        sprite: {
            x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 4
        },
        size: {width: 16, height: 32},
    }

}
