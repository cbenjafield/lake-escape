<template>
  <div class="intro">
    <div class="bg-image">
      <img src="../assets/intro-bg.jpg" width="1200" height="800" alt="pen drawing of Borrowdale" />
    </div>

    <div class="title">
      <img src="../assets/title.png" width="500" height="387" alt="title: Storm in the Lakes" />
    </div>

    <div class="text shadowed-text">
      <p>You are out hiking in the Lakes, when suddenly "CRASH" - lightning strikes close by.</p>
      <p>You need to get back to your car to drive to safety!</p>
    </div>

    <div class="button">
      <button class="continue-button" type="button" @click="game.start()">
        Begin...
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game.js'
const game = useGameStore()
</script>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.2rem;
}

.bg-image {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.bg-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.6;
}

.title {
  opacity: 1;
  position: relative;
  max-width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 1rem 0;
}

.title img {
  max-width: 100%;
  width: 70%;
  height: auto;
}

.text {
  position: relative;
  font-size: 1.7rem;
  line-height: 130%;
  padding: 1.4rem;
}

.button {
  padding: 1.4rem;
  position: relative;
}
</style>