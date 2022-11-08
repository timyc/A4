import { defineStore } from "pinia";
import { SleepData } from '@/structs/sleep-data';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';

export const useSettingsStore = defineStore("settingsStore", {
    state: () => ({
        sleepTime: 8 * 60 * 60, // hours * minutes * seconds
        age: 18,
        sleepData: [] as SleepData[],
        overnightSleepData: [] as OvernightSleepData[],
        stanfordSleepinessData: [] as StanfordSleepinessData[],
    }),
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
    persist: true,
});