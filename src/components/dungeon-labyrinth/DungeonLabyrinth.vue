<template>
  <div class="min-h-screen">
    <header class="header">
      <button class="back-button" @click="goBack">Back</button>
    </header>
    <main class="main-content">
      <div class="dungeon-labyrinth" @keydown="handleKeydown" tabindex="0" ref="gameContainer">
        <h1>Dungeon Labyrinth</h1>
        <div class="grid">
          <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                class="cell"
                :class="{
                'cell--start': isStart(rowIndex, colIndex),
                'cell--portal': isPortal(rowIndex, colIndex),
              }"
            >
              <svg v-if="cell" :width="100" :height="100" xmlns="http://www.w3.org/2000/svg" :style="{ transform: `rotate(${cell.rotation}deg)` }">
                <g :class="cell.type">
                  <use :xlink:href="`#${cell.type}`" />
                </g>
              </svg>
              <div v-if="isPlayerPosition(rowIndex, colIndex)" class="character-container">
                <div class="health-bar">
                  <svg v-for="i in playerHealth" :key="i" width="12" height="12" viewBox="0 0 12 12">
                    <use :xlink:href="i <= playerHealth ? '#heart-full' : '#heart-empty'" />
                  </svg>
                </div>
                <div v-if="state === 'COMBAT'" class="dice-button" @click="rollDice" :class="{ 'disabled': diceRolled }">
                  {{ diceRolled ? playerRoll : 'Roll' }}
                </div>
                <svg
                    class="player"
                    :class="{ 'selected': state === 'MOVE_PLAYER' }"
                    width="40" height="40" viewBox="0 0 100 100"
                >
                  <use xlink:href="#orc-player" />
                </svg>
              </div>
              <div v-if="isEnemyPosition(rowIndex, colIndex)" class="character-container enemy-container">
                <div class="enemy-strength">{{ getEnemyStrength(rowIndex, colIndex) }}</div>
                <svg
                    class="enemy"
                    width="40" height="40" viewBox="0 0 100 100"
                >
                  <use xlink:href="#warrior-enemy" />
                </svg>
              </div>
              <svg v-if="isCurrentCardPosition(rowIndex, colIndex) && currentCard"
                   :width="100" :height="100"
                   xmlns="http://www.w3.org/2000/svg"
                   :style="{ transform: `rotate(${currentCard.rotation}deg)` }"
                   :class="['current-card', { 'invalid-placement': !isValidPlacement(rowIndex, colIndex) }]">
                <g :class="currentCard.type">
                  <use :xlink:href="`#${currentCard.type}`" />
                </g>
              </svg>
              <div v-if="isPortal(rowIndex, colIndex) && isPlayerPosition(rowIndex, colIndex)" class="next-level-button">
                Next Level
              </div>
            </div>
          </div>
        </div>
        <div v-if="state === 'GAME_OVER'" class="win-message">GAME OVER!</div>
      </div>

      <!-- SVG Definitionen -->
      <svg width="0" height="0" style="position: absolute;">
        <defs>
          <g id="corner-path">
            <rect fill="#8B4513" height="100" width="100" x="0" y="0"/>
            <path d="m30,30l70,0l0,40l-30,0.25l0,29.75l-40,0l0,-70z" fill="#808080"/>
            <path d="m1,1l7.84,12l-5.88,10l9.8,8l-7.84,15l11.76,7l-6.86,18l8.82,10l-9.8,9m90.16,-89l-9.8,5l4.9,10l-7.84,8l5.88,12l-9.8,7l7.84,15l-11.76,6l6.86,18l-8.82,10" fill="none" stroke="#6b3610"/>
            <path d="m37,95l3,-20l-5,-15m27,30l-2,-25l4,-10m33,5l-20,-3l-15,5" fill="none" stroke="#707070"/>
          </g>
          <g id="t-junction">
            <rect fill="#8B4513" height="100" width="100"/>
            <path d="m0,30l100,0l0,40l-30,0.25l0,29.75l-40,0l0,-30l-30,0l0,-40z" fill="#808080"/>
            <path d="m8.25,3.375l0.59,9.625l13.12,-3.375l-3.95,23.125l17.91,3.75l-13.24,22.125l7.015,5.375l-11.055,15.875l9.575,13m70.785,-91.875l-9.8,5l4.9,10l-21.59,1.75l19.63,18.25l-15.925,6.875l13.965,15.125l-14.635,17.125l9.735,6.875l-4.32,13.25" fill="none" stroke="#753a10"/>
            <path d="m37,95l3,-20l-5,-15m-31.375,-24.5l18.625,5.75l30.5,-5.75m44.25,24.5l-20,-3l-11,-10.25" fill="none" stroke="#707070"/>
          </g>
          <g id="straight-path">
            <rect fill="#8B4513" height="100" width="100"/>
            <path d="m0,30.625l100,-0.625l0,40l-30,0.25l-40,-0.25l-30,0l0,-39.375z" fill="#808080"/>
            <path d="m7.83,4.045l-4.535,9.625l13.12,-3.375l-8.825,24.375l13.285,5.5l-3.74,19.125l7.015,5.375l-1.805,18.375l-10.925,9.25m83.91,-88.75l-11.675,3.125l4.9,10l-11.84,5.125l9.88,14.875l-4.3,10.25l2.34,11.75l7.865,14.75l-12.765,9.25l1.93,13" fill="none" stroke="#753a10" transform="rotate(90 49.3125 49.6075)"/>
            <path d="m48.6508,64.32609l-15.41447,-4.23366m-31.375,-24.5l21.67912,-2.97857l27.44588,2.97857m44.25,24.5l-13.92311,-11.78793l-17.07689,-1.46207" fill="none" stroke="#707070" transform="rotate(-6.00005 48.5488 48.47)"/>
          </g>
          <g id="crossroads">
            <rect fill="#8B4513" height="100" width="100" x="0" y="0"/>
            <path d="m0,30.25l30,-0.25l0,-30l40,0l0,30l30,0l0,40l-30,0l0,30.25l-40,0l0,-30l-30,0l0,-40z" fill="#808080"/>
            <path d="m15.18844,7.34486l0.4624,9.05345l10.28248,-3.17458l-3.09572,21.75178l14.03653,3.52732l-10.37653,20.81117l5.49784,5.05582l-8.66409,14.93231l7.50417,12.22803m55.47603,-86.41925l-7.68051,4.70309l3.84026,9.40618l-16.92064,1.64608l15.38454,17.16627l-12.48083,6.46675l10.94473,14.22684l-11.46983,16.10808l7.62957,6.46675l-3.3857,12.46318" fill="none" stroke="#753a10" transform="rotate(7.23151 50.75 49.4375)"/>
            <path d="m36.5884,87.3436l2.62797,-17.83603l-4.37994,-13.37703m-27.48415,-21.84914l16.31529,5.12786l26.71766,-5.12786m38.7625,21.84914l-17.51977,-2.67541l-9.63588,-9.14097" fill="none" stroke="#707070" transform="matrix(1 0 0 1 0 0) rotate(-15.4295 48.25 60.8125)"/>
          </g>
          <g id="portal">
            <rect fill="#8B4513" height="100" width="100" x="0" y="0"/>
            <path d="m0,30.25l30,-0.25l0,-30l40,0l0,30l30,0l0,40l-30,0l0,30.25l-40,0l0,-30l-30,0l0,-40z" fill="#808080"/>
            <path d="m15.18844,7.34486l0.4624,9.05345l10.28248,-3.17458l-3.09572,21.75178l14.03653,3.52732l-10.37653,20.81117l5.49784,5.05582l-8.66409,14.93231l7.50417,12.22803m55.47603,-86.41925l-7.68051,4.70309l3.84026,9.40618l-16.92064,1.64608l15.38454,17.16627l-12.48083,6.46675l10.94473,14.22684l-11.46983,16.10808l7.62957,6.46675l-3.3857,12.46318" fill="none" stroke="#753a10" transform="rotate(7.23151 50.75 49.4375)"/>
            <path d="m36.5884,87.3436l2.62797,-17.83603l-4.37994,-13.37703m-27.48415,-21.84914l16.31529,5.12786l26.71766,-5.12786m38.7625,21.84914l-17.51977,-2.67541l-9.63588,-9.14097" fill="none" stroke="#707070" transform="matrix(1 0 0 1 0 0) rotate(-15.4295 48.25 60.8125)"/>
            <circle cx="50" cy="50" r="25" fill="#00008B"/>
            <circle cx="50" cy="50" r="20" fill="#4169E1">
              <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="42" cy="42" r="8" fill="#87CEFA" opacity="0.6">
              <animate attributeName="r" values="9;8;9" dur="2s" repeatCount="indefinite"/>
            </circle>
          </g>
          <g id="start">
            <rect fill="#8B4513" height="100" id="svg_4" transform="matrix(1 0 0 1 0 0)" width="100" x="0" y="0"/>
            <path d="m0,30.25l30,-0.25l0,-30l40,0l0,30l30,0l0,40l-30,0l0,30.25l-40,0l0,-30l-30,0l0,-40z" fill="#808080" fill-opacity="0.87" id="svg_5"/>
            <g fill="none" id="svg_2" stroke="#8D6E63" stroke-width="0.5" transform="matrix(1 0 0 1 0 0)">
              <path d="m12.25,0q20,50 0,100m20,-100q20,50 0,100m20,-100q20,50 0,100m20,-100q20,50 0,100" id="svg_3"/>
              <path d="m40,10q5,30 20,40q-10,20 -15,40" fill="none" id="svg_1" stroke="#3E2723"/>
              <path d="m70,5q-10,25 5,55q-10,20 -5,35" fill="none" id="svg_6" stroke="#3E2723"/>
            </g>
          </g>
          <g id="orc-player">
            <defs>
              <radialGradient cx="0.27997" cy="0.43359" id="svg_12" r="0.5" spreadMethod="pad">
                <stop offset="0.00262" stop-color="#007f7f" stop-opacity="0.99609"/>
                <stop offset="1" stop-color="#007f3f" stop-opacity="0.99609"/>
              </radialGradient>
              <linearGradient id="svg_14" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0.02997" stop-color="#396011" stop-opacity="0.99219"/>
                <stop offset="0.99091" stop-color="#0d5959" stop-opacity="0.99609"/>
              </linearGradient>
            </defs>
            <path d="m8.75,50.5q5,-30 40,-40q35,10 40,40q-5,30 -40,40q-35,-10 -40,-40" fill="url(#svg_12)" id="svg_1" transform="matrix(1 0 0 1 0 0)"/>
            <path d="m11.125,47.125l-8.75,-24.125l17.25,4.75l-8.5,19.375zm77.125,2.25l3.125,-28.625l-13.125,8.75l10,19.875z" fill="url(#svg_14)" id="svg_2"/>
            <path d="m25,39.875l15,-10l-5,15l-10,-5zm50,0l-15,-10l5,15l10,-5z" fill="#FFF" id="svg_3"/>
            <circle cx="32" cy="37.875" fill="#bf005f" id="svg_4" r="3" transform="matrix(1 0 0 1 0 0)"/>
            <circle cx="68" cy="37.875" fill="#ff007f" id="svg_5" r="3" transform="matrix(1 0 0 1 0 0)"/>
            <path d="m45,54.875q5,5 10,0q-5,10 -10,0" fill="#282802" id="svg_6" transform="matrix(1 0 0 1 0 0)"/>
            <path d="m23.43016,67.96702q26.24793,-4.8662 52.49587,0" fill="none" id="svg_7" stroke="#084908" stroke-width="4" transform="matrix(1 0 0 1 0 0) rotate(0.507029 49.6781 66.7505)"/>
            <path d="m28.875,27.375l15.5,6.875m7.875,0.625l16.625,-7.5" fill="none" id="svg_8" stroke="#1f4406" stroke-width="5" transform="matrix(1 0 0 1 0 0)"/>
          </g>
          <g id="warrior-enemy">
            <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="#8B4513"/>
            <circle cx="50" cy="35" r="20" fill="#D2691E"/>
            <rect x="40" y="55" width="20" height="30" fill="#A0522D"/>
            <path d="M30,85 Q50,95 70,85" fill="none" stroke="#8B4513" stroke-width="5"/>
            <circle cx="43" cy="30" r="5" fill="#000"/>
            <circle cx="57" cy="30" r="5" fill="#000"/>
            <rect x="45" y="40" width="10" height="5" fill="#000"/>
            <path d="M20,20 L35,35 M80,20 L65,35" stroke="#000" stroke-width="3"/>
          </g>
          <symbol id="heart-full" viewBox="0 0 20 20">
            <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" fill="red"/>
          </symbol>
          <symbol id="heart-empty" viewBox="0 0 20 20">
            <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" fill="gray"/>
          </symbol>
        </defs>
      </svg>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function goBack() {
  router.push('/');
}

const GRID_SIZE = 5;
const START_POSITION = { row: GRID_SIZE - 1, col: 0 };
const PORTAL_POSITION = { row: Math.floor(GRID_SIZE / 2), col: Math.floor(GRID_SIZE / 2) };

const cardTypes = ['corner-path', 't-junction', 'straight-path', 'crossroads'];

const grid = ref(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
const currentCard = ref(null);
const playerPosition = ref({ ...START_POSITION });
const enemies = ref([]);
const gameContainer = ref(null);
const state = ref('PLACE_CARD');
const cardPosition = ref({ row: 0, col: 0 });
const playerRoll = ref(0);
const diceRolled = ref(false);
const previousPosition = ref({ ...START_POSITION });
const playerHealth = ref(3);
const currentLevel = ref(1);

function initializeGrid() {
  grid.value = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
  grid.value[START_POSITION.row][START_POSITION.col] = { type: 'start', rotation: 0 };
  grid.value[PORTAL_POSITION.row][PORTAL_POSITION.col] = { type: 'portal', rotation: 0 };
}

function drawNewCard() {
  const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  currentCard.value = { type: randomType, rotation: 0 };
  placeCardOnEmptyCell();
  state.value = 'PLACE_CARD';
}

function placeCardOnEmptyCell() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (isValidPlacement(row, col)) {
        cardPosition.value = { row, col };
        return;
      }
    }
  }
}

function rotateCurrentCard() {
  if (currentCard.value) {
    currentCard.value.rotation = (currentCard.value.rotation + 90) % 360;
  }
}

function placeCard() {
  const { row, col } = cardPosition.value;
  if (currentCard.value && isValidPlacement(row, col)) {
    grid.value[row][col] = { ...currentCard.value };
    currentCard.value = null;
    state.value = 'MOVE_PLAYER';
  }
}

function isStart(row, col) {
  return row === START_POSITION.row && col === START_POSITION.col;
}

function isPortal(row, col) {
  return row === PORTAL_POSITION.row && col === PORTAL_POSITION.col;
}

function isPlayerPosition(row, col) {
  return row === playerPosition.value.row && col === playerPosition.value.col;
}

function isEnemyPosition(row, col) {
  return enemies.value.some(enemy => enemy.row === row && enemy.col === col);
}

function getEnemyStrength(row, col) {
  const enemy = enemies.value.find(enemy => enemy.row === row && enemy.col === col);
  return enemy ? enemy.strength : 0;
}

function isCurrentCardPosition(row, col) {
  return state.value === 'PLACE_CARD' &&
      currentCard.value &&
      row === cardPosition.value.row &&
      col === cardPosition.value.col;
}

function isValidPlacement(row, col) {
  return !grid.value[row][col] && !isStart(row, col) && !isPortal(row, col);
}

function isValidMove(row, col) {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false;

  const currentCell = grid.value[playerPosition.value.row][playerPosition.value.col];
  const targetCell = grid.value[row][col];

  if (!currentCell || !targetCell) return false;

  const direction = getDirection(playerPosition.value, { row, col });
  return hasPath(currentCell, direction) && hasPath(targetCell, getOppositeDirection(direction));
}

function getDirection(from, to) {
  if (from.row < to.row) return 'down';
  if (from.row > to.row) return 'up';
  if (from.col < to.col) return 'right';
  if (from.col > to.col) return 'left';
}

function getOppositeDirection(direction) {
  const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
  return opposites[direction];
}

function hasPath(cell, direction) {
  const paths = {
    'corner-path': ['down', 'right'],
    't-junction': ['up', 'right', 'down'],
    'straight-path': ['up', 'down'],
    'crossroads': ['up', 'right', 'down', 'left'],
    'start': ['up', 'right', 'down', 'left'],
    'portal': ['up', 'right', 'down', 'left'],
  };

  const cellPaths = paths[cell.type];
  const rotatedDirection = rotateDirection(direction, cell.rotation);
  return cellPaths.includes(rotatedDirection);
}

function rotateDirection(direction, rotation) {
  const directions = ['up', 'right', 'down', 'left'];
  const index = directions.indexOf(direction);
  const rotatedIndex = (index + rotation / 90) % 4;
  return directions[rotatedIndex];
}

function movePlayerTo(row, col) {
  previousPosition.value = { ...playerPosition.value };
  playerPosition.value = { row, col };
  checkWinCondition();
  if (state.value !== 'GAME_OVER' && state.value !== 'LEVEL_COMPLETE') {
    const existingEnemy = enemies.value.find(enemy => enemy.row === row && enemy.col === col);
    if (existingEnemy) {
      state.value = 'COMBAT';
    } else {
      spawnEnemy(row, col);
      state.value = 'COMBAT';
    }
  }
}

function checkWinCondition() {
  if (isPortal(playerPosition.value.row, playerPosition.value.col)) {
    state.value = 'LEVEL_COMPLETE';
  }
}

function spawnEnemy(row, col) {
  const strength = Math.min(Math.floor(Math.random() * 6) + currentLevel.value, 11);
  enemies.value.push({ row, col, strength });
}

function rollDice() {
  if (state.value === 'COMBAT' && !diceRolled.value) {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    playerRoll.value = dice1 + dice2;
    diceRolled.value = true;
    setTimeout(resolveCombat, 1000); // Delay to show the roll result
  }
}

function resolveCombat() {
  const { row, col } = playerPosition.value;
  const enemyIndex = enemies.value.findIndex(enemy => enemy.row === row && enemy.col === col);
  const enemy = enemies.value[enemyIndex];

  if (playerRoll.value > enemy.strength) {
    enemies.value.splice(enemyIndex, 1);
    state.value = 'PLACE_CARD';
    drawNewCard();
  } else {
    playerPosition.value = { ...previousPosition.value };
    playerHealth.value--;

    if (playerHealth.value === 0) {
      state.value = 'GAME_OVER';
    } else {
      state.value = 'MOVE_PLAYER';
    }
  }

  diceRolled.value = false;
  playerRoll.value = 0;
}

function goToNextLevel() {
  currentLevel.value++;
  initializeGrid();
  playerPosition.value = { ...START_POSITION };
  previousPosition.value = { ...START_POSITION };
  playerHealth.value = 2 + currentLevel.value;
  enemies.value = [];
  state.value = 'PLACE_CARD';
  drawNewCard();
}

function handleKeydown(event) {
  const key = event.key;

  if (state.value === 'PLACE_CARD') {
    handleCardPlacement(key);
  } else if (state.value === 'MOVE_PLAYER') {
    handlePlayerMovement(key);
  } else if (state.value === 'COMBAT' && key === 'Enter') {
    rollDice();
  } else if (state.value === 'LEVEL_COMPLETE' && key === 'Enter') {
    goToNextLevel();
  }

  event.preventDefault();
}

function handleCardPlacement(key) {
  if (!currentCard.value) return;

  switch (key) {
    case 'ArrowUp':
      if (cardPosition.value.col > 0) moveCard(0, -1);
      break;
    case 'ArrowDown':
      if (cardPosition.value.col < GRID_SIZE - 1) moveCard(0, 1);
      break;
    case 'ArrowLeft':
      if (cardPosition.value.row > 0) moveCard(-1, 0);
      break;
    case 'ArrowRight':
      if (cardPosition.value.row < GRID_SIZE - 1) moveCard(1, 0);
      break;
    case ' ':
      rotateCurrentCard();
      break;
    case 'Enter':
      placeCard();
      break;
  }
}

function moveCard(deltaRow, deltaCol) {
  const newRow = cardPosition.value.row + deltaRow;
  const newCol = cardPosition.value.col + deltaCol;
  if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
    cardPosition.value = { row: newRow, col: newCol };
  }
}

function handlePlayerMovement(key) {
  const { row, col } = playerPosition.value;
  let newRow = row;
  let newCol = col;

  switch (key) {
    case 'ArrowUp':
      newCol--;
      break;
    case 'ArrowDown':
      newCol++;
      break;
    case 'ArrowLeft':
      newRow--;
      break;
    case 'ArrowRight':
      newRow++;
      break;
    case 'Enter':
      drawNewCard();
      return;
  }

  if (isValidMove(newRow, newCol)) {
    movePlayerTo(newRow, newCol);
  }
}

onMounted(() => {
  gameContainer.value.focus();
  initializeGrid();
  drawNewCard();
});
</script>

<style scoped>

.dungeon-labyrinth {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  outline: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-gap: 0;
  margin-bottom: 20px;
}

.cell {
  width: 100px;
  height: 100px;
  box-shadow: 0 0 0 1px #ccc inset;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.current-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.player {
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 10;
}

.player.selected {
  filter: drop-shadow(0 0 3px #FFD700);
}


button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}

.cell {
  position: relative;
}

.current-card {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  box-shadow: 0 0 3px 3px green;
}

.current-card.invalid-placement {
  box-shadow: 0 0 3px 3px red;
}

.win-message {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
}

.enemy {
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 10;
}

.combat-info {
  margin-top: 20px;
  text-align: center;
}

.combat-info button {
  margin-top: 10px;
}

.character-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 70px;
}

.enemy-container {
  right: 0;
}

.dice-button {
  position: absolute;
  top: -10px;
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 2px 2px;
  cursor: pointer;
  border-radius: 3px;
}

.dice-button.disabled {
  background-color: #017f68;
  cursor: not-allowed;
}

.enemy-strength {
  position: absolute;
  top: 0;
  background-color: #f44336;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
  margin-bottom: 2px;
}

.combat-result {
  margin-top: 20px;
  text-align: center;
}

.combat-result button {
  margin-top: 10px;
}

.health-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  position: absolute;
  bottom: -10px;
}

.health-bar svg {
  margin: 0 2px;
}

.next-level-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  z-index: 20;
}

</style>