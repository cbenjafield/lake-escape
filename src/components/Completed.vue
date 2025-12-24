<template>
  <div class="bg-image">
    <img :src="completedImage" class="baxter" alt="baxter" width="1536" height="1024" />
  </div>
  <div class="text">
    <div class="shadowed-text">
      <h2>Congratulations!</h2>
      <p>You escaped the locked shed and made it back to your car in time (phew).</p>
      <p>For Christmas, I'd love to gift you an escape room for us to do.</p>
      <p>I hope you enjoyed this little one ;)</p>
      <p>Lots of love,</p>
      <p>Charlie 🧡</p>
    </div>
    <div class="restart">
      <button type="button" class="continue-button" @click="restartGame">
        Restart?
      </button>
    </div>
  </div>
</template>

<style scoped>
.text {
  position: absolute;
  inset: 0;
  padding: 1rem;
  font-size: 1.8rem;
}

.restart {
  position: absolute;
  bottom: 1rem;
  padding: 1rem;
}
</style>

<script setup>
import { useGameStore } from '../stores/game.js'
import { ASSETS } from '../assets/assetUrls.js'

const completedImage = ASSETS.completed

const game = useGameStore()

const restartGame = () => {
  if (confirm('Are you sure you want to restart the game? Your progress will be lost.')) {
    game.reset()
  }
}
</script>