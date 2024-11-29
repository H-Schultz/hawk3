export const GAME_STATE = {
    CHOOSE: 'choose',
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
    13: {x: 0, y: SPRITE_SIZE * 3, zIndex: 0}, // Mauer mit Schlüsselloch
    14: {x: SPRITE_SIZE * 2, y: 0, zIndex: 1}, // Schmale Mauer Oben
    15: {x: SPRITE_SIZE * 4, y: 0, zIndex: 1}, // Schmale Mauer Oben Verziert
    17: {x: SPRITE_SIZE * 4, y: SPRITE_SIZE, zIndex: 1, frames: 3, frameOffset: SPRITE_SIZE}, // rote Tränke Mitte
    18: {x: SPRITE_SIZE * 4, y: SPRITE_SIZE * 3, zIndex: 1, frames: 3, frameOffset: SPRITE_SIZE}, // blaue Tränke Mitte
    19: {x: 0, y: SPRITE_SIZE * 2, zIndex: 1}, // Brüchige zerstöbare Mauer
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
        // Level 0: Choose character and weapon
        layout: [
            [ 0, 14, 14, 14, 14, 14, 14, 15, 14, 14, 14, 14, 14, 0],
            [ 0, 10, 11, 11, 11, 11, 11, 17, 11, 11, 11, 11, 10, 0],
            [ 0, 12, 21, 20, 21, 22, 20, 71, 20, 21, 20, 20, 10, 0],
            [ 0, 12, 90, 20, 20, 20, 20, 20, 20, 20, 20, 20, 10, 0],
            [ 0, 12, 21, 20, 20, 20, 22, 20, 20, 20, 20, 23, 10, 0],
            [ 0, 12, 98, 20, 20, 23, 20, 21, 20, 20, 20, 20, 10, 0],
            [ 0, 12, 23, 20, 20, 20, 20, 20, 20, 20, 21, 24, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 10, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        name: 'Düstere Höhle',
        type: 'quest',
        allowedEnemyTypes: [],
        allowedItems: [],
        maxEnemies: 0,
        quests: [
            {
                npc: {x: 5, y: 2, direction: 'left'},
                chooseCharacter: true,
                description: [
                    'Willkommen, tapferer Abenteurer!',
                    'chooseCharacter',
                    'chooseWeapon',
                    'Wähle dein Charakter und deine Waffe.'
                ],
                goal: 0,
                type: 'RED_POTION',
                gift: 'RED_KEY',
                successMessage: 'Gut gemacht! Du bist bereit für die nächste Herausforderung.',
                spots: []
            }
        ]
    }, {
        // Level 1: Quest: Einführung
        layout: [
            [ 0, 14, 14, 14, 14, 15, 14, 14, 14, 14, 14, 14, 14, 0],
            [ 0, 10, 11, 11, 11, 17, 11, 11, 11, 11, 11, 11, 10, 0],
            [ 0, 12, 90, 20, 21, 71, 20, 23, 20, 21, 20, 20, 10, 0],
            [ 0, 12, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 10, 0],
            [ 0, 12, 98, 30, 20, 19, 20, 20, 19, 20, 30, 21, 10, 0],
            [ 0, 12, 21, 20, 19, 20, 30, 20, 20, 19, 20, 23, 10, 0],
            [ 0, 12, 20, 19, 20, 23, 20, 21, 19, 20, 20, 20, 10, 0],
            [ 0, 12, 20, 20, 20, 20, 20, 20, 20, 20, 40, 40, 10, 0],
            [ 0, 12, 40, 40, 41, 40, 23, 40, 40, 21, 10, 11, 10, 0],
            [ 0, 12, 10, 10, 18, 11, 19, 11, 11, 23, 13, 21, 11, 0],
            [ 0, 12, 22, 20, 72, 20, 19, 20, 11, 11, 11, 20, 10, 0],
            [ 0, 12, 20, 21, 20, 20, 19, 20, 20, 20, 20, 20, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 12, 40, 40, 40, 40, 40, 10, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        name: 'Düstere Höhle',
        type: 'quest',
        allowedEnemyTypes: ['GOBLIN'],
        allowedItems: ['RED_KEY', 'BOMB', 'HEART', 'MANA'],
        maxEnemies: 2,
        chests: [
            { x: 10, y: 6, type: 'CHEST_GOLD' },
            { x: 4, y: 11, type: 'CHEST_GOLD' }
        ],
        quests: [
            {
                npc: {x: 6, y: 2, direction: 'left'},
                description: [
                    'Willkommen, tapferer Abenteurer!',
                    'Diese düstere Höhle birgt viele Geheimnisse und Gefahren.',
                    'Ich werde dir die Grundlagen des Spiels erklären.',
                    'Bewege dich mit den Pfeiltasten oder WASD.',
                    'Drücke E, um anzugreifen. Halte E gedrückt für einen starken Rundumschlag.',
                    'Drücke F, um Bomben zu legen. Vorsicht, sie können dir auch schaden.',
                    'Sammle rote Tränke, um deine Gesundheit wiederherzustellen.',
                    'Sammle blaue Tränke, um dein Mana aufzufüllen.',
                    'Vermeide Fallen und besiege Feinde, um voranzukommen.',
                    'Sammle die 6 Gegenstände, um diese Quest abzuschließen.'
                ],
                goal: 3,
                type: 'RED_POTION',
                gift: 'RED_KEY',
                successMessage: 'Gut gemacht! Du bist bereit für die nächste Herausforderung.',
                spots: [
                    {x: 3, y: 3, collected: false, name: 'item', type: 'RED_POTION'},
                    {x: 5, y: 5, collected: false, name: 'item', type: 'HEART'},
                    {x: 7, y: 6, collected: false, name: 'item', type: 'BOMB'},
                    {x: 9, y: 7, collected: false, name: 'item', type: 'RED_KEY'},
                    {x: 7, y: 7, collected: false, name: 'item', type: 'MANA'}
                ]
            }
        ]
    }, {
        // Level 2: Quest: Die verlorenen Münzen des alten Königreichs
        layout: [
            [ 0, 14, 14, 14, 14, 15, 14, 14, 15, 14, 14, 14, 14, 14, 15, 14, 14, 14, 0],
            [ 0, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 0],
            [ 0, 10, 21, 20, 21, 20, 20, 20, 30, 20, 98, 20, 20, 23, 20, 20, 20, 12, 0],
            [ 0, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 12, 0],
            [ 0, 10, 90, 20, 11, 11, 17, 11, 11, 20, 11, 11, 11, 11, 11, 20, 23, 12, 0],
            [ 0, 10, 20, 20, 11, 20, 71, 21, 11, 30, 11, 25, 20, 20, 19, 20, 20, 12, 0],
            [ 0, 10, 30, 20, 13, 23, 20, 22, 11, 20, 19, 23, 20, 23, 13, 20, 30, 12, 0],
            [ 0, 10, 20, 20, 11, 25, 20, 24, 11, 20, 11, 21, 20, 20, 19, 20, 20, 12, 0],
            [ 0, 10, 23, 20, 11, 11, 11, 11, 11, 30, 11, 11, 11, 11, 11, 20, 21, 12, 0],
            [ 0, 10, 20, 20, 12, 20, 20, 20, 20, 20, 22, 20, 30, 20, 12, 20, 20, 12, 0],
            [ 0, 10, 30, 20, 12, 30, 23, 30, 20, 20, 20, 21, 20, 20, 12, 20, 30, 12, 0],
            [ 0, 10, 20, 20, 12, 20, 20, 20, 20, 23, 20, 20, 30, 20, 12, 20, 20, 12, 0],
            [ 0, 10, 21, 20, 11, 11, 11, 11, 11, 18, 11, 11, 11, 11, 11, 20, 22, 12, 0],
            [ 0, 10, 20, 20, 20, 20, 20, 21, 20, 72, 20, 20, 20, 20, 20, 20, 23, 12, 0],
            [ 0, 10, 25, 20, 19, 23, 20, 20, 30, 20, 20, 20, 20, 19, 20, 21, 24, 12, 0],
            [ 0, 10, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 12, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        name: 'Die Schatzkammer',
        type: 'quest',
        allowedEnemyTypes: ['SKELETON', 'GOBLIN'],
        allowedItems: ['RED_KEY', 'BOMB', 'RED_POTION'],
        maxEnemies: 3,
        chests: [
            { x: 6, y: 6, type: 'CHEST_GOLD' },
            { x: 12, y: 6, type: 'CHEST_GOLD' },
            { x: 6, y: 10, type: 'CHEST_GOLD' }
        ],
        quests: [
            {
                npc: {x: 5, y: 2, direction: 'left'},
                description: [
                    'Ah, ein mutiger Abenteurer! Genau was ich brauche.',
                    'Diese Katakomben bergen ein dunkles Geheimnis...',
                    'Vor langer Zeit wurde hier der Königsschatz versteckt,',
                    'aber Goblins und Skelette haben die goldenen Münzen gestohlen.',
                    'Die magischen Münzen sind über die ganze Kammer verstreut.',
                    'Finde alle 10 Münzen, und ich werde dir den Weg zum Endboss zeigen!',
                    'Aber sei vorsichtig: Die Fallen sind tödlich,',
                    'und die verschlossenen Türen benötigen spezielle Schlüssel.',
                    'Die Schatztruhen könnten nützliche Gegenstände enthalten.',
                    'Möge das Glück mit dir sein, tapferer Held!'
                ],
                goal: 10,
                type: 'COIN',
                gift: 'RED_KEY',
                successMessage: 'Unglaublich! Du hast alle Münzen gefunden! Hier ist der Schlüssel zur Bosshalle.',
                spots: [
                    {x: 8, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 13, y: 2, collected: false, name: 'item', type: 'COIN'},
                    {x: 7, y: 6, collected: false, name: 'item', type: 'COIN'},
                    {x: 13, y: 6, collected: false, name: 'item', type: 'COIN'},
                    {x: 3, y: 9, collected: false, name: 'item', type: 'COIN'},
                    {x: 8, y: 9, collected: false, name: 'item', type: 'COIN'},
                    {x: 13, y: 9, collected: false, name: 'item', type: 'COIN'},
                    {x: 5, y: 14, collected: false, name: 'item', type: 'COIN'},
                    {x: 8, y: 14, collected: false, name: 'item', type: 'COIN'},
                    {x: 12, y: 14, collected: false, name: 'item', type: 'COIN'}
                ]
            }
        ]
    }, {
        layout: [
            [ 0, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 0],
            [ 0, 11, 11, 17, 11, 11, 11, 11, 11, 17, 11, 11, 0],
            [ 0, 12, 21, 71, 21, 21, 20, 21, 20, 71, 90, 10, 0],
            [ 0, 12, 20, 30, 20, 20, 20, 20, 21, 30, 20, 10, 0],
            [ 0, 12, 21, 20, 20, 30, 23, 30, 20, 21, 21, 10, 0],
            [ 0, 12, 20, 20, 30, 19, 20, 19, 30, 20, 23, 10, 0],
            [ 0, 12, 23, 20, 20, 20, 30, 20, 20, 20, 98, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 40, 40, 40, 40, 40, 10, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        enemiesRequired: 20,
        name: 'Kriegerhalle',
        type: 'combat',
        allowedEnemyTypes: ['SKELETON', 'GOBLIN', 'ORC'],
        allowedItems: ['BLUE_POTION', 'RED_POTION'],
        maxEnemies: 7
    }, {
        layout: [
            [ 0, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 0],
            [ 0, 11, 11, 17, 11, 11, 11, 11, 11, 17, 11, 11, 0],
            [ 0, 12, 98, 71, 21, 21, 20, 21, 20, 71, 20, 10, 0],
            [ 0, 12, 20, 30, 20, 20, 20, 20, 21, 30, 20, 10, 0],
            [ 0, 12, 21, 20, 20, 30, 23, 30, 20, 21, 21, 10, 0],
            [ 0, 12, 20, 20, 30, 19, 20, 19, 30, 20, 23, 10, 0],
            [ 0, 12, 23, 20, 20, 20, 30, 20, 20, 20, 90, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 40, 40, 40, 40, 40, 10, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        enemiesRequired: 1,
        name: 'Kriegerhalle',
        type: 'boss',
        allowedItems: ['RED_KEY'],
        chests: [
            { x: 6, y: 3, type: 'CHEST_GOLD' },
        ],
        bossConfig: {
            type: 'boss',
            name: 'BOSS',
            position: {x: 6, y: 6},
        }
    }, {
        // Level 3: Die Prüfung des Kriegers
        layout: [
            [ 0, 14, 14, 14, 14, 15, 14, 14, 15, 14, 14, 14, 14, 14, 15, 14, 14, 14, 0],
            [ 0, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 0],
            [ 0, 10, 90, 20, 21, 20, 20, 20, 30, 20, 20, 20, 20, 23, 20, 20, 20, 12, 0],
            [ 0, 10, 40, 40, 40, 40, 41, 40, 40, 20, 40, 40, 41, 40, 40, 30, 20, 12, 0],
            [ 0, 10, 11, 11, 11, 11, 18, 11, 11, 20, 11, 11, 17, 11, 11, 21, 22, 12, 0],
            [ 0, 10, 20, 20, 20, 20, 72, 20, 11, 30, 11, 20, 71, 20, 19, 20, 20, 12, 0],
            [ 0, 10, 30, 20, 11, 23, 20, 22, 11, 98, 11, 23, 20, 23, 13, 20, 30, 12, 0],
            [ 0, 10, 20, 20, 11, 25, 20, 24, 11, 20, 11, 21, 20, 20, 19, 20, 20, 12, 0],
            [ 0, 10, 23, 11, 11, 11, 11, 11, 11, 30, 11, 11, 11, 11, 11, 23, 24, 12, 0],
            [ 0, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 12, 0],
            [ 0, 10, 30, 11, 11, 11, 11, 11, 20, 21, 11, 11, 11, 11, 11, 20, 30, 12, 0],
            [ 0, 10, 20, 20, 30, 20, 23, 11, 20, 20, 11, 22, 20, 24, 11, 20, 20, 12, 0],
            [ 0, 10, 21, 13, 20, 20, 20, 11, 20, 20, 11, 21, 20, 20, 11, 20, 22, 12, 0],
            [ 0, 10, 20, 11, 21, 20, 30, 13, 20, 20, 23, 20, 20, 20, 13, 20, 23, 12, 0],
            [ 0, 10, 25, 11, 11, 11, 11, 11, 11, 19, 11, 11, 11, 11, 11, 20, 24, 12, 0],
            [ 0, 10, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 12, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
        ],
        name: 'Die Kriegerkammer',
        type: 'quest',
        allowedEnemyTypes: ['SKELETON', 'GOBLIN', 'ORC'],
        allowedItems: ['RED_KEY', 'BOMB', 'GREEN_POISON', 'RED_POTION', 'BLUE_POTION'],
        maxEnemies: 5,
        chests: [
            { x: 6, y: 6, type: 'CHEST_GOLD' },
            { x: 12, y: 6, type: 'CHEST_GOLD' },
            { x: 5, y: 12, type: 'CHEST_GOLD' },
            { x: 12, y: 12, type: 'CHEST_GOLD' }
        ],
        quests: [
            {
                npc: {x: 6, y: 2, direction: 'left'},
                description: [
                    'Halt, Krieger! Du suchst also den Weg zum Endboss?',
                    'Aber bist du auch würdig genug für diese Herausforderung?',
                    'In dieser Kammer warten acht mächtige Gegner auf dich.',
                    'Zwei Skelettkrieger, die seit Jahrhunderten hier wachen,',
                    'drei gerissene Goblins, die ihre Opfer hinterrücks angreifen,',
                    'und drei brutale Orks, die alles zermalmen, was sich ihnen in den Weg stellt.',
                    'Bezwinge sie alle, und ich werde dich als würdig erachten.',
                    'Die Schatztruhen enthalten Tränke - du wirst sie brauchen.',
                    'Und vergiss nicht: Die verschlossenen Türen können nur',
                    'mit dem richtigen Schlüssel geöffnet werden.',
                    'Zeige mir, dass du ein wahrer Held bist!'
                ],
                goal: 8,
                type: 'ENEMY',
                gift: 'RED_KEY',
                successMessage: 'Beeindruckend! Du bist wahrlich ein Meister des Kampfes! Hier ist der Schlüssel zur Bosshalle.',
                spots: [
                    {x: 8, y: 3, collected: false, name: 'enemy', type: 'SKELETON'},
                    {x: 13, y: 3, collected: false, name: 'enemy', type: 'SKELETON'},
                    {x: 3, y: 6, collected: false, name: 'enemy', type: 'GOBLIN'},
                    {x: 8, y: 6, collected: false, name: 'enemy', type: 'ORC'},
                    {x: 13, y: 6, collected: false, name: 'enemy', type: 'GOBLIN'},
                    {x: 8, y: 11, collected: false, name: 'enemy', type: 'ORC'},
                    {x: 3, y: 13, collected: false, name: 'enemy', type: 'GOBLIN'},
                    {x: 13, y: 13, collected: false, name: 'enemy', type: 'ORC'}
                ]
            }
        ]
    }, {
        layout: [
            [ 0, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
            [ 0, 12, 98, 30, 21, 22, 20, 30, 20, 20, 10, 0],
            [ 0, 12, 30, 22, 20, 23, 30, 11, 19, 20, 10, 0],
            [ 0, 12, 20, 19, 30, 20, 23, 19, 20, 20, 10, 0],
            [ 0, 12, 20, 30, 23, 30, 20, 30, 20, 10, 11, 0],
            [ 0, 12, 23, 20, 20, 22, 30, 11, 22, 90, 10, 0],
            [ 0, 12, 40, 40, 40, 40, 40, 19, 40, 40, 11, 0],
            [ 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
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
];

export const LEVEL_CONFIG = {
    healthBonus: 0,
};

export const ITEM_TYPES = {
    HEART: {
        name: 'heart',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 21},
        size: {width: 16, height: 16},
        frames: 1,
        floating: true,
    },
    MANA: {
        name: 'mana',
        sprite: {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 21},
        size: {width: 16, height: 16},
        frames: 1,
        floating: true,
    },
    COIN: {
        name: 'coin',
        sprite: {
            x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 24
        },
        size: {width: 8, height: 9},
        frames: 4,
        frameOffset: SPRITE_SIZE / 2,
        floating: false,
    },
    RED_POTION: {
        name: 'redPotion',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 22},
        size: {width: 16, height: 16},
        frames: 1,
        floating: true,
    },
    BLUE_POTION: {
        name: 'bluePotion',
        sprite: {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 22},
        size: {width: 16, height: 16},
        frames: 1,
        floating: true,
    },
    GREEN_POISON: {
        name: 'greenPoison',
        sprite: {x: SPRITE_SIZE * 20, y: SPRITE_SIZE * 21},
        size: {width: 16, height: 16},
        frames: 1,
        damage: 1,
        floating: false,
        destroyable: true
    },
    RED_KEY: {
        name: 'redKey',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 18},
        size: {width: 16, height: 16},
        frames: 1,
        floating: false,
        destroyable: false
    },
    CHEST_GOLD: {
        name: 'CHEST_GOLD',
        sprite: {
            closed: [
                {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 26},
            ],
            opened: [
                {x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 26},
            ],
            empty: [
                {x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 25},
            ],
        },
        state: 'closed',
        size: {width: 16, height: 16},
        frames: 1,
        destroyable: false,
        floating: false,
        barrier: true
    },
    CHEST_EMPTY: {
        name: 'CHEST_EMPTY',
        sprite: {
            closed: [
                {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 25},
            ],
            opened: [
                {x: SPRITE_SIZE * 21, y: SPRITE_SIZE * 25},
            ],
        },
        state: 'opened',
        size: {width: 16, height: 16},
        frames: 1,
        destroyable: false,
        floating: false,
        barrier: true
    },
    BOMB: {
        name: 'bomb',
        sprite: {x: SPRITE_SIZE * 18, y: SPRITE_SIZE * 20},
        size: {width: 16, height: 16},
        frames: 1,
        floating: false,
        destroyable: true
    },
    BOMB_BURN: {
        name: 'bombBurn',
        sprite: {x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 20},
        size: {width: 16, height: 16},
        frames: 2,
        frameOffset: SPRITE_SIZE,
        floating: false,
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
        dropChance: 0.9,
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
        dropChance: 0.6,
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
    },
    SPEAR: {
        damage: 2,
        sprite: {
            x: SPRITE_SIZE * 19, y: SPRITE_SIZE * 10
        },
        size: {width: 16, height: 32},
    },
}
