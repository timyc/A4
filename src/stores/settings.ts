import { defineStore } from "pinia";
import { SleepData } from '@/structs/sleep-data';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';

export const useSettingsStore = defineStore("settingsStore", {
    state: () => {
        return {
            sleepTime: 8 * 60 * 60, // hours * minutes * seconds
            age: 18,
            sleepData: [] as SleepData[],
            overnightSleepData: [] as OvernightSleepData[],
            stanfordSleepinessData: [] as StanfordSleepinessData[],
        }
    },
    actions: {
        setAge(age: number) {
            this.age = age;
        },
        setSleepTime(sleepTime: number) {
            this.sleepTime = sleepTime;
        },
        addOvernightSleepData(sleepData: OvernightSleepData) {
            this.sleepData.push(sleepData);
            this.overnightSleepData.push(sleepData);
        },
        addStanfordSleepinessData(sleepData: StanfordSleepinessData) {
            this.sleepData.push(sleepData);
            this.stanfordSleepinessData.push(sleepData);
        }
    },
    persist: {
        key: "settingsStore",
        afterRestore: (ctx) => {
            // Convert the dates back to Date objects and set the prototype
            for (const x of ctx.store.$state.overnightSleepData) {
                x.__proto__ = OvernightSleepData.prototype;
                x.sleepStart = new Date(x.sleepStart);
                x.sleepEnd = new Date(x.sleepEnd);
            }
            for (const x of ctx.store.$state.sleepData) {
                x.__proto__ = SleepData.prototype;
                x.loggedAt = new Date(x.loggedAt);
            }
        }
    },
});