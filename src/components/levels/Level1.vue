<template>
  <div class="bg-image">
    <img src="../../assets/cabin.jpg" class="cabin" alt="log cabin under stormy sky" width="851" height="1342" v-show="step < 3" />
    <img src="../../assets/wood-bg.jpg" class="wood" alt="wooden background texture" width="600" height="900" v-show="step === 3" loading="eager" />
    <img src="../../assets/cabin-interior.jpg" class="cabin-interior" alt="cabin interior" width="827" height="945" v-show="step === 4" loading="eager" />
  </div>

  <img src="../../assets/maps.png" class="maps" width="700" height="903" v-if="step === 3" alt="maps of Helvellyn and Skiddaw" />

  <div class="level">
    <div class="text shadowed-text">
      <p v-if="step === 1">You come across a log cabin that looks like a great place to seek shelter.</p>
      <div v-if="step === 2">
        <p>You knock on the door, which has a code keypad by the handle.</p>
        <p>"Who's there?" a voice asks through the video doorbell.</p>
        <p>"We're seeking shelter from this storm. Please could we come in until this rain passes?"</p>
        <p>"You can enter if you can figure out the entry code." the voice replies.</p>
      </div>
      <div v-if="step === 4">
        <p>The code was right. This seems like a great place to hang out until this bout of heavy rain and lightning passes.</p>
        <p>But after a while, you need to get going...</p>
      </div>
      <button class="continue-button" type="button" @click="game.nextLevel1Step()" v-if="step === 1">
        Continue...
      </button>
      <button class="continue-button" type="button" v-if="step === 4" @click="game.solve()">
        Embrace the rain...
      </button>
    </div>
    <button class="table-box" @click="game.nextLevel1Step()" type="button" v-if="step === 2"></button>
  </div>

  <div class="keypad" v-if="step === 3">
    <div class="keypad-box">
      <div class="keypad-screen">
        <span v-for="i in 4" :key="i">{{ code[i - 1] ?? '*' }}</span>
        <span class="keypad-error" v-if="error">{{ error }}</span>
      </div>

      <div class="keypad-numbers">
        <button
            type="button"
            v-for="btn in buttons"
            :key="btn.key"
            @click="onKey(btn)"
            :disabled="btn.type === 'enter' && code.length !== 4"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { LEVEL_ANSWERS } from '../../answers.js'
import { useGameStore } from '../../stores/game.js'

const game = useGameStore()

const code = ref('')
const error = ref(null)
const errorTimeout = ref(null)

const step = computed(() => game.level1Step)

const buttons = computed(() => ([
  { key: '1', type: 'digit', value: '1', label: '1' },
  { key: '2', type: 'digit', value: '2', label: '2' },
  { key: '3', type: 'digit', value: '3', label: '3' },
  { key: '4', type: 'digit', value: '4', label: '4' },
  { key: '5', type: 'digit', value: '5', label: '5' },
  { key: '6', type: 'digit', value: '6', label: '6' },
  { key: '7', type: 'digit', value: '7', label: '7' },
  { key: '8', type: 'digit', value: '8', label: '8' },
  { key: '9', type: 'digit', value: '9', label: '9' },
  { key: 'clear', type: 'clear', label: 'CLEAR' },
  { key: '0', type: 'digit', value: '0', label: '0' },
  { key: 'enter', type: 'enter', label: 'ENTER' },
]))

const errorOut = (message) => {
  error.value = message

  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value)
  }

  errorTimeout.value = setTimeout(() => {
    error.value = null
  }, 2000)
}

const onKey = (btn) => {
  if (btn.type === 'digit') {
    if (code.value.length < 4) code.value += btn.value
    return
  }

  if (btn.type === 'clear') {
    code.value = ''
    return
  }

  if (btn.type === 'enter') {
    if (code.value.length !== 4) return

    if (code.value === LEVEL_ANSWERS.LEVEL_1) {
      game.level1Step = 4
      game.save()
    } else {
      errorOut('Incorrect code.')
    }
  }
}
</script>

<style scoped>
.bg-image img.cabin {
  object-position: bottom left;
}

.level {
  position: fixed;
  inset: 0;
  padding: 1.2rem;
}

.text {
  font-size: 1.8rem;
  line-height: 120%;
}

.table-box {
  appearance: none;
  border: none;
  position: fixed;
  bottom: 0.5rem;
  left: 0.5rem;
  width: 70vw;
  height: 24vh;
  background: none;
}

.table-box:focus {
  outline: none;
}

.keypad {
  position: fixed;
  bottom: 1rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.keypad-box {
  background: #000;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1rem;
  border-radius: 1rem;
  background: url('../../assets/keypad.png') no-repeat center/contain;
  width: 80vw;
  aspect-ratio: 0.67;
}

.keypad-screen {
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--colour-light-green);
  position: absolute;
  top: 8%;
  left: 16%;
  width: 69%;
  height: 17%;
  column-gap: 1.2rem;
  font-size: 2.8rem;
}

.keypad-screen span {
  font-family: monospace;
}

.keypad-screen span.keypad-error {
  color: var(--colour-light-red);
  font-size: 0.8rem;
  position: absolute;
  bottom: 0.2rem;
}

.keypad-numbers {
  position: absolute;
  bottom: 10%;
  left: 50%;
  width: 70%;
  transform: translateX(-49%);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 1rem;
}

.keypad-numbers button {
  background: url('../../assets/keypad-button.png') no-repeat center/cover;
  appearance: none;
  border: none;
  color: #000;
  font-size: 2rem;
  font-family: monospace;
  flex-shrink: 0;
  aspect-ratio: 1.053;
}

.keypad-numbers button:nth-child(10),
.keypad-numbers button:nth-child(12) {
  font-size: 1rem;
}

.keypad-numbers button:nth-child(12) {
  color: var(--colour-green);
}

.keypad-numbers button:nth-child(10) {
  color: var(--colour-red);
}

.maps {
  position: fixed;
  top: 2rem;
  width: 100vw;
  height: auto;
}
</style>