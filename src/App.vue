<template>
  <div v-if="loading" class="splash">
    <div class="loading-text">
      <div>Loading...</div>
      <div class="bar" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
        <div class="barFill" :style="{ width: percent + '%' }"></div>
      </div>
    </div>
  </div>
  <EscapeRoom v-else />
</template>

<script setup>
import EscapeRoom from './components/EscapeRoom.vue'
import { computed, onMounted, ref } from 'vue'
import { PRELOAD_URLS } from './assets/assetUrls.js'

const loadedCount = ref(0)
const errorCount = ref(0)
const loading = ref(true)

const totalCount = computed(() => PRELOAD_URLS.length)
const percent = computed(() =>
  totalCount.value === 0 ? 100 : Math.round((loadedCount.value / totalCount.value) * 100)
)

function preloadImages(urls, { timeoutMs = 15000 } = {}) {
  loadedCount.value = 0;
  errorCount.value = 0;

  if (!urls.length) return Promise.resolve()

  const withTimeout = (p) =>
      new Promise((resolve) => {
        const t = setTimeout(() => resolve('timeout'), timeoutMs)
        p.then(
            (v) => {
              clearTimeout(t)
              resolve(v)
            },
            () => {
              clearTimeout(t)
              resolve('error')
            }
        )
      })

  const tasks = urls.map((src) =>
    withTimeout(
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve('ok')
          img.onerror = () => reject(new Error('failed'))
          img.src = src
        })
    ).then((result) => {
      loadedCount.value++
      if (result !== 'ok') errorCount.value++
    })
  )

  return Promise.all(tasks).then(() => undefined)
}

onMounted(async () => {
  const minSplashMs = 500
  const start = performance.now()

  await preloadImages(PRELOAD_URLS, { timeoutMs: 1500 })

  const elapsed = performance.now() - start
  const remaining = Math.max(0, minSplashMs - elapsed)

  if (remaining) await new Promise((r) => setTimeout(r, remaining))

  loading.value = false
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  background: url('./assets/borrowdale.jpg') no-repeat center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  padding: 1rem;
  border-radius: 1rem;
  background: #fff;
  width: 80%;
  text-align: center;
  font-size: 1.4rem;
}

.bar {
  margin-top: 1rem;
  height: 10px;
  background: #dcdcdc;
  border-radius: 5px;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.barFill {
  background: #000;
  height: 10px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>