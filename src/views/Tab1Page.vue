<script lang="ts">
import { defineComponent } from 'vue';
import "vue3-circle-progress/dist/circle-progress.css";
import { useSettingsStore } from '@/stores/settings';
import { settingsOutline } from 'ionicons/icons';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import CircleProgress from 'vue3-circle-progress';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/vue';

export default defineComponent({
  name: 'Tab1Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, CircleProgress, IonIcon },
  setup() {
    const settingsStore = useSettingsStore();
    return {
      settingsStore, settingsOutline
    }
  },
  data() {
    return {
      state: 0,
      seconds: 0,
      goal: 10,
      timer: undefined as unknown as number,
      startTime: undefined as unknown as Date,
      endTime: undefined as unknown as Date,
    }
  },
  methods: {
    incrementTimer() {
      this.timer = setInterval(() => {
        this.seconds++;
      }, 1000);
    },

    formatTime(sec: number): string {
      let hours = Math.floor(sec / 3600);
      let minutes = Math.floor((sec - (hours * 3600)) / 60);
      let seconds = sec - (hours * 3600) - (minutes * 60);
      return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    },

    startSleep() {
      this.startTime = new Date();
      this.state = 1;
      this.incrementTimer();
    },
    stopSleep() {
      this.endTime = new Date();
      this.settingsStore.addOvernightSleepData(new OvernightSleepData(this.startTime, this.endTime));
      this.state = 0;
      this.seconds = 0;
      clearInterval(this.timer);
    }
  }
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">{{ seconds > 0 ? `Sleeping for ${formatTime(seconds)}` : `Sleep Tracker` }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-icon class="p-relative" size="large" :icon="settingsOutline" style="padding:5px;opacity:0.5"></ion-icon>
    <div class="splash"></div>
    <ion-content>
      <div class="container">
        <circle-progress class="p-absolute" :size="210" fill-color="#9145B6" empty-color="rgba(63, 59, 108, 0.85)" :percent="60" />
        <circle-progress :is-bg-shadow="true" fill-color="#ffffff" empty-color="rgba(63, 59, 108, 0.7)" :percent="seconds < goal ? Math.floor((seconds/goal) * 100) : 100" />
        <ion-button shape="round" fill="outline" v-if="state == 0" @click="startSleep">Start</ion-button>
        <ion-button color="danger" shape="round" fill="outline" v-if="state == 1" @click="stopSleep">Stop</ion-button>
        <h2 class="heading p-absolute" style="top:60vh;left:10px">Recent Logs</h2>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-button[shape="round"] {
  --border-radius: 50%;
  height: 150px;
  width: 150px;
  position: absolute;
}
.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.splash {
  background-image: url('@/assets/nightfade.png');
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

</style>