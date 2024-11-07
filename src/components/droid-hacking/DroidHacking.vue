<template>
  <div class="min-h-screen">
    <header class="header">
      <button class="back-button" @click="goBack">Back</button>
    </header>
    <main class="main-content">
      <div class="droid-hacking">
        <div class="mother-board">
          <div class="yellow-side">
            <div class="cable-slot cable-slot--first">
              <div class="cable-count">{{ remainingYellowCables }}</div>
            </div>
            <div v-for="i in 12" :key="`yellow-${i}`" class="cable-slot">
              <div
                  class="beginning yellow"
                  :class="{
                  'beginning--disabled': remainingYellowCables === 0,
                  'beginning--active': yellowConnections[i - 1]
                }"
                  @click="placeConnection('yellow', i - 1)"
              ></div>
            </div>
          </div>
          <div class="connection-area">
            <div class="connection-row connection-row--first">
              <div
                  class="ending ending--score"
                  :class="{
                  'yellow': yellowScore > purpleScore,
                  'purple': yellowScore < purpleScore,
                  'draw': yellowScore === purpleScore,
                }"
              ></div>
            </div>
            <div v-for="(connection, index) in connections" :key="index" class="connection-row">
              <div class="line yellow-segments">
                <div
                    v-for="(segment, segIndex) in connection.yellowSegments"
                    :key="`segment-${index}-${segIndex}`"
                    class="line-segment"
                    :class="[segment.color,
                    {
                      active: segment.active,
                      'line-segment--switch': segment.switch,
                      'line-segment--stop': segment.stop,
                      'line-segment--transparent': segment.color === 'transparent',
                    }]"
                >
                  <div
                      v-if="segment.switch"
                      class="switch"
                      :class="[segment.switch.color, segment.switch.direction]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <polygon points="0,10 20,0 20,20" stroke="black" stroke-width="2" />
                    </svg>
                  </div>
                  <svg v-else-if="segment.stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="stop-symbol">
                    <rect x="2" y="2" width="16" height="16" stroke="black" stroke-width="2"></rect>
                  </svg>
                </div>
              </div>
              <div class="ending" :class="centerConnections[index]"></div>
              <div class="line purple-segments">
                <div
                    v-for="(segment, segIndex) in connection.purpleSegments"
                    :key="`segment-${index}-${segIndex}`"
                    class="line-segment"
                    :class="[segment.color,
                    {
                      active: segment.active,
                      'line-segment--switch': segment.switch,
                      'line-segment--stop': segment.stop,
                      'line-segment--transparent': segment.color === 'transparent',
                    }]"
                >
                  <div
                      v-if="segment.switch"
                      class="switch"
                      :class="[segment.switch.color, segment.switch.direction]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <polygon points="0,10 20,0 20,20" stroke="black" stroke-width="2" />
                    </svg>
                  </div>
                  <svg v-else-if="segment.stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="stop-symbol">
                    <rect x="2" y="2" width="16" height="16" stroke="black" stroke-width="2"></rect>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="purple-side">
            <div class="cable-slot cable-slot--first">
              <div class="cable-count">{{ remainingPurpleCables }}</div>
            </div>
            <div v-for="i in 12" :key="`purple-${i}`" class="cable-slot">
              <div
                  class="beginning purple"
                  :class="{
                  'beginning--disabled': remainingPurpleCables === 0,
                  'beginning--active': purpleConnections[i - 1]
                }"
                  @click="placeConnection('purple', i - 1)"
              ></div>
            </div>
          </div>
        </div>
        <div class="scores">
          <div class="score yellow">Yellow: {{ yellowScore }}</div>
          <div class="score purple">Purple: {{ purpleScore }}</div>
        </div>
        <button class="new-game-btn" @click="newGame">NEW GAME</button>
      </div>
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

let connections = ref(Array(12).fill(0).map((_, i) => i % 2 === 0 ? 1 : 2))
let yellowConnections = ref(Array(12).fill(false))
let purpleConnections = ref(Array(12).fill(false))
let centerConnections = ref(Array(12).fill('draw'))
let remainingYellowCables = ref(7)
let remainingPurpleCables = ref(7)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const createSegments = () => {
  const segments = [
    { color: 'neutral', active: false },
    { color: 'neutral', active: false },
    { color: 'neutral', active: false }
  ]

  let hasStopFeature = false;
  for (let i = 0; i < 3; i++) {
    const randomFeature = (hasStopFeature || i < 1) ? 1 : Math.random();
    if (randomFeature < 0.1) {
      segments[i].switch = {
        color: Math.random() < 0.5 ? 'yellow' : 'purple',
        direction: Math.random() < 0.5 ? 'left' : 'right'
      }
    } else if (randomFeature < 0.2) {
      segments[i].stop = true
      hasStopFeature = true
    } else if (randomFeature < 0.3) {
      segments[i].junction = {
        direction: Math.random() < 0.5 ? 'up' : 'down'
      }
    } else if (hasStopFeature) {
      segments[i].color = 'transparent'
    }
  }

  return segments
}

const initializeConnections = () => {
  connections.value = Array(12).fill(0).map(() => {
    const yellowSegments = createSegments()
    const purpleSegments = createSegments()

    return {
      yellowSegments: yellowSegments,
      purpleSegments: purpleSegments.reverse()
    }
  })
}

const newGame = () => {
  yellowConnections.value = Array(12).fill(false)
  purpleConnections.value = Array(12).fill(false)
  centerConnections.value = Array(12).fill('draw')
  remainingYellowCables.value = 7
  remainingPurpleCables.value = 7
  initializeConnections()
}

onMounted(initializeConnections);

const placeConnection = (color, index) => {
  if (color === 'yellow' && !yellowConnections.value[index] && remainingYellowCables.value > 0) {
    yellowConnections.value[index] = true;
    remainingYellowCables.value--;

    let changedColor = 'yellow';
    let changedActive = true;
    const connectionLength = connections.value[index].yellowSegments.length;
    for (let i = 0; i < connectionLength; i++) {
      if (!changedActive) break;
      if (connections.value[index].yellowSegments[i].stop) {
        changedActive = false;
        break;
      } else if (connections.value[index].yellowSegments[i].switch) {
        changedColor = connections.value[index].yellowSegments[i].switch.color
        changedActive = connections.value[index].yellowSegments[i].switch.direction === 'right'
      }
      connections.value[index].yellowSegments[i].color = changedColor
      connections.value[index].yellowSegments[i].active = changedActive
      if (i === connectionLength - 1 && changedActive) {
        if (centerConnections.value[index] === 'draw') {
          centerConnections.value[index] = changedColor;
        } else if (centerConnections.value[index] !== changedColor) {
          centerConnections.value[index] = 'draw';
        }
      }
    }
  } else if (color === 'purple' && !purpleConnections.value[index] && remainingPurpleCables.value > 0) {
    purpleConnections.value[index] = true;
    remainingPurpleCables.value--;

    let changedColor = 'purple';
    let changedActive = true;
    const connectionLength = connections.value[index].purpleSegments.length;
    for (let i = connectionLength - 1; i >= 0; i--) {
      if (!changedActive) break;
      if (connections.value[index].purpleSegments[i].stop) {
        changedActive = false;
        break;
      } else if (connections.value[index].purpleSegments[i].switch) {
        changedColor = connections.value[index].purpleSegments[i].switch.color
        changedActive = connections.value[index].purpleSegments[i].switch.direction === 'left'
      }
      connections.value[index].purpleSegments[i].color = changedColor
      connections.value[index].purpleSegments[i].active = changedActive
      if (i === 0 && changedActive) {
        if (centerConnections.value[index] === 'draw') {
          centerConnections.value[index] = changedColor;
        } else if (centerConnections.value[index] !== changedColor) {
          centerConnections.value[index] = 'draw';
        }
      }
    }
  }
}

const yellowScore = computed(() => centerConnections.value.filter(c => c === 'yellow').length)
const purpleScore = computed(() => centerConnections.value.filter(c => c === 'purple').length)
</script>

<style scoped>

.droid-hacking {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 640px;
}

.mother-board {
  display: flex;
  justify-content: space-between;
  background-color: #8b4513;
  padding: 20px;
  border-radius: 10px;
}

.yellow-side, .purple-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cable-slot {
  height: 24px;
  display: flex;
  align-items: center;
}

.cable-count {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: #fff;
  box-shadow: 0 0 0 4px black;
}

.beginning {
  width: 20px;
  height: 20px;
  cursor: pointer;
  box-shadow: 0 0 0 4px black;
  background-color: #aaa;
}
.beginning.yellow { background-color: #1d2b07; }
.beginning.purple { background-color: #1f0933; }
.beginning.yellow.beginning--active, .beginning.yellow:not(.beginning--disabled):hover { background-color: #adff2f; }
.beginning.purple.beginning--active, .beginning.purple:not(.beginning--disabled):hover { background-color: #8a2be2; }
.beginning--disabled { cursor: not-allowed; }
.beginning--disabled:not(.beginning--active) { background-color: #000; }
.beginning.purple.beginning--disabled:not(.beginning--active) { background-color: #000; }

.connection-area {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 2;
}

.connection-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
}

.line {
  position: relative;
  display: flex;
  width: calc(50% - 20px);
  height: 4px;
  margin: 0;
  z-index: 2;
}
.line.yellow { background-color: #adff2f; }
.line.purple { background-color: #8a2be2; }

.line-segment {
  flex-grow: 1;
  height: 100%;
  background-color: #000;
  position: relative;
}
.line-segment.active.yellow { background-color: #adff2f; }
.line-segment.active.purple { background-color: #8a2be2; }
.line-segment--stop { background-color: transparent; }
.line-segment--transparent { background-color: transparent; }

.switch {
  position: absolute;
  top: -8px;
  width: 24px;
  height: 20px;
  transform: translateX(-50%);
  z-index: 1;
}
.line.yellow-segments .switch { left: 0; }
.line.purple-segments .switch { left: 100%; }
.switch.left { transform: translateX(-50%) rotate(0deg); }
.switch.right { transform: translateX(-50%) rotate(180deg); }
.switch svg {
  width: 100%;
  height: 100%;
}
.switch.yellow svg polygon {
  fill: #adff2f;
}
.switch.purple svg polygon {
  fill: #8a2be2;
}

.stop-symbol {
  position: absolute;
  top: -8px;
  width: 20px;
  height: 20px;
  transform: translateX(-50%);
  z-index: 1;
}
.line.yellow-segments .stop-symbol { left: 0; }
.line.yellow-segments .stop-symbol rect { fill: #adff2f; }
.line.purple-segments .stop-symbol { left: 100%; }
.line.purple-segments .stop-symbol rect { fill: #8a2be2; }

.ending {
  width: 40px;
  height: 20px;
  box-shadow: 0 0 0 4px black;
  z-index: 1;
}
.ending.yellow { background-color: #adff2f; }
.ending.purple { background-color: #8a2be2; }
.ending.draw { background-color: #aaa; }

.scores {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.score {
  font-size: 18px;
  font-weight: bold;
}
.score.yellow { color: #adff2f; }
.score.purple { color: #8a2be2; }

.new-game-btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.new-game-btn:hover {
  background-color: #45a049;
}
</style>