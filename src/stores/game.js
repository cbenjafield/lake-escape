import { defineStore } from 'pinia'

const STORAGE_KEY = 'lakeEscape.game'

const defaultState = () => ({
    stage: 'intro',
    level1Step: 1,
    level2Step: 1,
    level3Step: 1,
    menuOpen: false,
})

export const useGameStore = defineStore('game', {
    state: () => defaultState(),

    getters: {
        levelNumber: (state) => {
            const m = state.stage.match(/^level-(\d+)$/)
            return m ? Number(m[1]) : null
        },
        progressLabel() {
            return this.levelNumber ? `Door ${this.levelNumber} / 5` : ''
        },
        isIntro: (state) => state.stage === 'intro',
        isCompleted: (state) => state.stage === 'completed',
    },

    actions: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen
        },

        load() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY)
                if (!raw) return

                const parsed = JSON.parse(raw)
                const allowed = new Set([
                    'intro',
                    'level-1',
                    'level-2',
                    'level-3',
                    'completed',
                ])

                if (parsed?.stage && allowed.has(parsed.stage)) {
                    this.stage = parsed.stage
                }

                if (parsed?.level1Step) {
                    this.level1Step = parsed?.level1Step
                }

                if (parsed?.level2Step) {
                    this.level2Step = parsed?.level2Step
                }

                if (parsed?.level3Step) {
                    this.level3Step = parsed?.level3Step
                }
            } catch (error) {
                console.error(error)
            }
        },

        save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                stage: this.stage,
                level1Step: this.level1Step,
                level2Step: this.level2Step,
                level3Step: this.level3Step,
            }))
        },

        start() {
            this.stage = 'level-1'
            this.save()
        },

        solve() {
            if (this.stage === "level-1") this.stage = "level-2";
            else if (this.stage === "level-2") this.stage = "level-3";
            else if (this.stage === "level-3") this.stage = "completed";

            this.save();
        },

        reset() {
            Object.assign(this, defaultState())
            localStorage.removeItem(STORAGE_KEY)
        },

        nextLevel1Step() {
            this.level1Step += 1;
            this.save()
        },

        nextLevel2Step() {
            this.level2Step += 1;
            this.save()
        },

        nextLevel3Step() {
            this.level3Step += 1;
            this.save()
        }
    }
})