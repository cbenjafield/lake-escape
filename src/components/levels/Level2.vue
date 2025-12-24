<template>
  <div class="bg-image">
    <img :src="slateShelter" width="735" height="1241" alt="Slate shelter at the foot of Castle Crag" v-show="step === 1 || step === 2" loading="eager" />
    <img :src="slateWall" width="735" height="1241" alt="Slate wall background" v-show="step === 3 || step === 4" loading="eager" />
  </div>

  <div class="level" v-if="step === 1 || step === 2">
    <div class="shadowed-text">
      <div v-if="step === 1">
        <p>As you progress towards the car park it begins to get dark, and you need something to help light the way.</p>
        <p>You come across a small open shelter at the bottom of Castle Crag, and go inside.</p>
        <button class="continue-button" @click="game.nextLevel2Step()">
          Continue...
        </button>
      </div>
      <div v-if="step === 2">
        <p>Sitting on the floor of the cabin is a small locked box.</p>
        <button class="continue-button" @click="game.nextLevel2Step()">
          Continue...
        </button>
      </div>
    </div>
  </div>

  <div class="walls" v-if="step === 3">
    <div class="wall wall-1" v-show="wall === 1">
      <div class="text shadowed-text">
        <p>The box has a combination lock on it.</p>
      </div>
      <img :src="supplyBox" width="696" height="430" alt="supply box with combination lock" />

      <div class="combo-wrapper">
        <div class="combo" :class="error ? 'error' : ''">
          <div
              v-for="(val, i) in dials"
              :key="i"
              class="combo-dial"
              tabindex="0"
              role="spinbutton"
              :aria-label="`Dial ${i + 1}`"
              :aria-valuetext="val"
              @keydown.up.prevent="incDial(i)"
              @keydown.down.prevent="decDial(i)"
          >
            <button class="combo-dial-button up" type="button" @click="incDial(i)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>

            <div class="combo-dial-value">
              {{ val }}
            </div>

            <button class="combo-dial-button down" type="button" @click="decDial(i)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </button>
          </div>
        </div>
        <button type="button" class="continue-button combo-submit-button" @click="submit">
          OPEN
        </button>
      </div>
    </div>

    <div class="wall wall-2" v-show="wall === 2">
      <img :src="slateWallPhoto" width="600" class="slate-wall-photo" height="442" alt="photo of slate pile down to the river" />
    </div>

    <div class="wall wall-3" v-show="wall === 3">
      <img :src="aNotEquals1" class="anot1" width="600" height="619" alt="A != 1" />
      <img :src="chalkboard" class="chalkboard" width="600" height="682" alt="The end is the beginning CBA" />
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

  <div class="completed" v-if="step === 4">
    <div class="shadowed-text">
      <p>The box clicks open, revealing a torch inside.</p>
      <p>You take the torch and get back on your way.</p>

      <button class="continue-button" @click="game.solve()">
        Continue...
      </button>
    </div>

    <img :src="torch" width="500" height="811" alt="torch" class="torch" />
  </div>
</template>

<script setup>
import { useGameStore } from '../../stores/game.js'
import { computed, ref } from 'vue'
import { LEVEL_ANSWERS } from '../../answers.js'
import { ASSETS } from '../../assets/assetUrls.js'

const slateWall = ASSETS.slateWall
const slateShelter = ASSETS.slateShelter
const supplyBox = ASSETS.supplyBox
const chalkboard = ASSETS.chalkboard
const aNotEquals1 = ASSETS.aNotEquals1
const slateWallPhoto = ASSETS.slateWallPhoto
const torch = ASSETS.torch

const game = useGameStore()

const step = computed(() => game.level2Step)

const wall = ref(1);
const maxWalls = 3;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const dials = ref(Array(5).fill('A'))

const code = computed(() => dials.value.join('').toUpperCase())

const error = ref(false);
const errorTimeout = ref(null);

function decDial(i) {
  const current = dials.value[i]
  const idx = ALPHABET.indexOf(current)
  const nextIdx = (idx + 1) % ALPHABET.length
  dials.value[i] = ALPHABET[nextIdx]
}

function incDial(i) {
  const current = dials.value[i]
  const idx = ALPHABET.indexOf(current)
  const nextIdx = (idx - 1 + ALPHABET.length) % ALPHABET.length
  dials.value[i] = ALPHABET[nextIdx]
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

function submit() {
  if (code.value === LEVEL_ANSWERS.LEVEL_2) {
    game.nextLevel2Step()
  } else {
    errorOut()
  }
}
</script>

<style scoped>
.bg-image img.shelter-exterior {
  object-position: bottom left;
}

.level {
  position: fixed;
  top: 2rem;
  left: 1rem;
  right: 1.5rem;
}

.level p {
  font-size: 1.8rem;
}

.wall-1 {
  flex-direction: column;

  .text {
    font-size: 1.6rem;
  }

  img {
    width: 60%;
    height: auto;
    display: block;
    margin: 2rem auto;
  }
}

.combo-wrapper {
  margin-top: 2rem;
}

.combo {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.4rem;
  border-radius: 0.6rem;

  .combo-dial {
    background: #fff;
    border: 2px solid #000;
    display: inline-flex;
    flex-direction: column;
    flex: 1 1 0;

    .combo-dial-value {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1 1 0;
      font-size: 1.6rem;
    }

    .combo-dial-button {
      border: none;
      background: transparent;
      height: 40px;
      width: 100%;
      flex-shrink: 0;

      svg {
        display: inline-flex;
        height: 80%;
        width: 80%;
      }
    }
  }
}

.combo.error .combo-dial-value {
  color: var(--colour-light-red);
}

.combo-submit-button {
  width: 100%;
  margin-top: 1rem;
}

.wall-2 {
  img {
    width: 100%;
    height: auto;
    max-width: 800px;
  }
}

.wall-3 {
  .anot1 {
    position: absolute;
    top: 10%;
    left: 10%;
    width: 20%;
    height: auto;
    transform: rotate(-10deg);
    filter: grayscale(60%);
    z-index: 2;
  }
  .chalkboard {
    position: absolute;
    top: 10%;
    right: -20px;
    width: 90%;
    height: auto;
    z-index: 1;
    max-width: 500px;
  }
}

.torch {
  display: block;
  position: absolute;
  width: 50%;
  height: auto;
  right: 1rem;
  bottom: 1rem;
}

.completed {
  position: absolute;
  inset: 0;
  padding: 2rem;
  width: 100%;

  .shadowed-text {
    font-size: 2rem;
    line-height: 100%;
  }
}
</style>