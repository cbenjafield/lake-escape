<template>
  <div class="bg-image">
    <img src="../../assets/coniston.jpg" width="735" height="1241" class="coniston" alt="Coniston" v-if="step === 1 || step === 2" />
    <img src="../../assets/wood-bg.jpg" width="600" height="900" class="" alt="wooden wall" v-if="step === 3" />
    <img src="../../assets/coniston-sun.jpg" width="817" height="1407" class="" alt="coniston sun" v-if="step === 4" />
  </div>

  <div class="level" v-if="step === 1 || step === 2 || step === 4">
    <div class="shadowed-text" v-if="step === 1">
      <p>You make your way towards Coniston, when a huge bolt of lightning strikes nearby.</p>
      <p>Startled, you quickly run into a small wooden shed.</p>
      <button class="continue-button" type="button" @click="game.nextLevel3Step()">
        Continue...
      </button>
    </div>
    <div class="shadowed-text" v-if="step === 2">
      <p>A large gust of wind blows.</p>
      <p>SLAM! The door slams shut behind you, locking a combination lock behind you.</p>
      <p>You'll need to figure out the combination to get out!</p>
      <button class="continue-button" type="button" @click="game.nextLevel3Step()">
        Continue...
      </button>
    </div>
    <div class="shadowed-text" v-if="step === 4">
      <p>You escaped the locked shed.</p>
      <p>As you exit, the storm has passed and the sun has come through the dark clouds.</p>
      <button class="continue-button" type="button" @click="game.solve()">
        Continue...
      </button>
    </div>
  </div>

  <div class="walls" v-if="step === 3">
    <div class="wall wall-1" v-if="wall === 1">
      <div class="lock">
        <div class="dials" :class="error ? 'error' : ''">
          <div
              v-for="(val, i) in dials"
              :key="i"
              class="dial"
              tabindex="0"
              role="spinbutton"
              :aria-label="`Dial ${i + 1}`"
              :aria-valuetext="val"
              @keydown.up.prevent="incDial(i)"
              @keydown.down.prevent="decDial(i)"
          >
            <button class="dial-up" type="button" @click="incDial(i)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>
            <div class="dial-value">
              {{ val }}
            </div>
            <button class="dial-down" type="button" @click="decDial(i)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="wall wall-2" v-if="wall === 2">
      <img src="../../assets/plaque.png" width="1158" height="514" class="plaque" alt="Year Plaque" />
      <img src="../../assets/coniston-sailing.png" width="966" height="1200" class="sailing" alt="Sailing" />
    </div>

    <div class="wall wall-3" v-if="wall === 3">
      <img src="../../assets/coniston-newspaper.png" width="948" height="1320" class="newspaper" alt="Newspaper article" />
      <img src="../../assets/bluebird-herring.png" width="1024" height="1379" class="newspaper-herring" alt="Newspaper article" />
    </div>

    <div class="wall wall-4" v-if="wall === 4">
      <img src="../../assets/calendar.png" width="942" height="726" class="calendar" alt="Calendar" />
      <img src="../../assets/bluebird-cafe.png" width="966" height="1200" class="bluebird-cafe" alt="Bluebird Cafe" />
    </div>

    <button type="button" class="direction left" @click="directionLeft">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
    </button>
    <button type="button" class="direction right" @click="directionRight">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </button>
  </div>


</template>

<script setup>
import { useGameStore } from '../../stores/game.js'
import { computed, ref, watch } from 'vue'
import { LEVEL_ANSWERS } from '../../answers.js'

const game = useGameStore()

const step = computed(() => game.level3Step)

const wall = ref(1);
const maxWalls = 4;

const NUMBERS = '0123456789'
const dials = ref(Array(6).fill('0'))

const code = computed(() => dials.value.join('').toUpperCase())

const error = ref(false);
const errorTimeout = ref(null);

function decDial(i) {
  const current = dials.value[i]
  const idx = NUMBERS.indexOf(current)
  const nextIdx = (idx + 1) % NUMBERS.length
  dials.value[i] = NUMBERS[nextIdx]
}

function incDial(i) {
  const current = dials.value[i]
  const idx = NUMBERS.indexOf(current)
  const nextIdx = (idx - 1 + NUMBERS.length) % NUMBERS.length
  dials.value[i] = NUMBERS[nextIdx]
}

function directionLeft() {
  wall.value = ((wall.value - 2 + maxWalls) % maxWalls) + 1
}

function directionRight() {
  wall.value = (wall.value % maxWalls) + 1
}

const errorOut = () => {
  error.value = true

  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value)
  }

  errorTimeout.value = setTimeout(() => {
    error.value = false
  }, 1000)
}

const submitTimeout = ref(null)

watch(code, (newCode) => {
  if (submitTimeout.value) {
    clearTimeout(submitTimeout.value)
  }

  submitTimeout.value = setTimeout(() => {
    if (newCode === LEVEL_ANSWERS.LEVEL_3) {
      game.nextLevel3Step()
    } else {
      errorOut()
    }
  }, 1000)
})
</script>

<style scoped>
.level {
  position: absolute;
  top: 10%;
  font-size: 2rem;
  padding: 1rem;
}

.lock {
  position: absolute;
  aspect-ratio: 900 / 439;
  width: 1000px;
  height: auto;
  z-index: 10;
  background: url('../../assets/lock.png') no-repeat center/cover;
  right: -20px;

  .dials {
    width: 295px;
    height: 88px;
    background: black;
    position: absolute;
    top: 116px;
    right: 92px;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 3px;
    z-index: 10;

    .dial {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 6px;
      position: relative;

      .dial-up, .dial-down {
        position: absolute;
        width: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #000;
        background: #fff;
        height: 40px;
        border-radius: 999px;

        svg {
          display: inline-flex;
          height: 38px;
          width: 38px;
          color: #000;
        }
      }

      .dial-up {
        top: -45px;
      }

      .dial-down {
        bottom: -45px;
      }

      .dial-value {
        font-family: monospace;
        font-size: 3.5rem;
        font-weight: bold;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.dials.error {
  .dial-value {
    color: var(--colour-light-red);
  }
}

.newspaper {
  width: 80%;
  height: auto;
  position: fixed;
  left: 1rem;
  bottom: 2rem;
  transform: rotate(-5deg);
  z-index: 10;
}

.newspaper-herring {
  position: fixed;
  top: 1rem;
  right: 1rem;
  transform: rotate(12deg);
  width: 80%;
  height: auto;
}

.plaque {
  width: 90%;
  height: auto;
}

.calendar {
  width: 100%;
  height: auto;
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.bluebird-cafe {
  position: absolute;
  bottom: 1rem;
  right: -1rem;
  width: 80%;
  height: auto;
}

.sailing {
  bottom: 1rem;
  width: 95%;
  height: auto;
  position: absolute;
}

.plaque {
  position: absolute;
  top: 1rem;
  transform: rotate(-10deg);
  width: 100%;
  height: auto;
}
</style>