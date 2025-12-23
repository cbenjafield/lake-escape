<template>
  <header class="header" v-if="game.stage !== 'level-1'">
    <div class="settings-menu">
      <button type="button" class="settings-button" @click="game.toggleMenu()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" v-if="! game.menuOpen">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" v-else>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="settings-menu-content" v-if="game.menuOpen">
        <button class="settings-menu-button" type="button" @click="restart">
          Restart Game
        </button>
      </div>
    </div>
  </header>
  <component :is="Current" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '../stores/game.js'

import Intro from './Intro.vue'
import Completed from './Completed.vue'

import Level1 from './levels/Level1.vue'
import Level2 from './levels/Level2.vue'
import Level3 from './levels/Level3.vue'

const game = useGameStore()

onMounted(() => game.load())

const Current = computed(() => {
  switch (game.stage) {
    default: return Intro
    case 'level-1': return Level1
    case 'level-2': return Level2
    case 'level-3': return Level3
    case 'completed': return Completed
  }
})

const restart = () => {
  if (confirm('Are you sure you want to restart the game? Your progress will be lost.')) {
    game.reset()
  }
}
</script>

<style>
.header {
  position: fixed;
  z-index: 50;
  top: 0;
  right: 0;
  left: 0;
  padding: 0 0.5rem;
  height: 3rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.settings-menu {
  position: relative;
}

.settings-menu-content {
  position: absolute;
  top: 2.2rem;
  right: 0;
  background: #fff;
  border: 2px solid #000;
  border-radius: 0.5rem;
  padding: 0;
  width: 12rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.settings-button {
  width: 2.5rem;
  height: 2.5rem;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000;
  border-radius: 999px;
  position: relative;
  z-index: 20;
}

.settings-menu-button {
  display: flex;
  appearance: none;
  border: 0;
  width: 100%;
  background: #fff;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
}

.settings-menu-button:focus {
  background: #dedede;
}
</style>