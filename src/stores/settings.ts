import { defineStore } from "pinia";
import { SleepData } from '@/structs/sleep-data';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';

export const useSettingsStore = defineStore("settingsStore", {
    state: () => {
        return {
            sleepTime: 8 * 60 * 60, // hours * minutes * seconds
            age: 18,
            sleepType: 0,
            prevDelIndexAll: 0,
            prevDelIndexOvernight: 0,
            prevDelSleep: undefined as unknown as OvernightSleepData,
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
            this.sleepData.unshift(sleepData);
            this.overnightSleepData.unshift(sleepData);
        },
        addStanfordSleepinessData(sleepData: StanfordSleepinessData) {
            this.sleepData.unshift(sleepData);
            this.stanfordSleepinessData.unshift(sleepData);
        },
        deleteOvernightSleepData(sleepData: OvernightSleepData) {
            this.prevDelSleep = sleepData;
            this.prevDelIndexAll = this.sleepData.indexOf(sleepData);
            this.prevDelIndexOvernight = this.overnightSleepData.indexOf(sleepData);
            this.sleepData.splice(this.prevDelIndexAll, 1);
            this.overnightSleepData.splice(this.prevDelIndexOvernight, 1);
        },
        restoreOvernightSleepData() {
            console.log("Restored deleted");
            this.sleepData.splice(this.prevDelIndexAll, 0, this.prevDelSleep);
            this.overnightSleepData.splice(this.prevDelIndexOvernight, 0, this.prevDelSleep);
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
                x.loggedAt = new Date(x.loggedAt);
            }
            for (const x of ctx.store.$state.sleepData) {
                x.__proto__ = SleepData.prototype;
                x.loggedAt = new Date(x.loggedAt);
            }
        }
    },
});