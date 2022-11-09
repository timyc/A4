<script lang="ts">
import { defineComponent, computed } from 'vue';
import "vue3-circle-progress/dist/circle-progress.css";
import { useSettingsStore } from '@/stores/settings';
import { settingsOutline } from 'ionicons/icons';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import CircleProgress from 'vue3-circle-progress';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

export default defineComponent({
  name: 'Tab1Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, CircleProgress, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent },
  setup() {
    const settingsStore = useSettingsStore();
    const sleepData = computed(() => settingsStore.overnightSleepData);
    return {
      settingsStore, sleepData, settingsOutline
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
      scrollPosition: null as unknown as number,
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
      const data = new OvernightSleepData(this.startTime, this.endTime);
      this.settingsStore.addOvernightSleepData(data);
      this.state = 0;
      this.seconds = 0;
      clearInterval(this.timer);
    },
    handleScroll(ev: CustomEvent) {
      this.scrollPosition = ev.detail.scrollTop;
      },
  },
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
          <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" :icon="settingsOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
        <ion-title>{{ seconds > 0 ? `Sleeping for ${formatTime(seconds)}` : `Sleep Tracker` }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <div :class="['splash',{'invisible': scrollPosition > 50}]"></div>
    <ion-content :scroll-events="true" @ionScroll="handleScroll($event)">
      <div class="container">
        <circle-progress class="p-absolute" :size="210" fill-color="#9145B6" empty-color="rgba(63, 59, 108, 0.85)" :percent="60" />
        <circle-progress :is-bg-shadow="true" fill-color="#ffffff" empty-color="rgba(63, 59, 108, 0.7)" :percent="seconds < goal ? Math.floor((seconds/goal) * 100) : 100" />
        <ion-button shape="round" fill="outline" v-if="state == 0" @click="startSleep">Start</ion-button>
        <ion-button color="danger" shape="round" fill="outline" v-if="state == 1" @click="stopSleep">Stop</ion-button>
        <div class="p-absolute" style="top:60vh">
          <h2 class="heading" style="max-width:140px">Recent Logs</h2>
          <div style="flex-direction: column;">
            <ion-card v-for="log in sleepData.slice(0, 3)" :key="log.id">
              <ion-card-header>
                <ion-card-title>{{ log.dateString() }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>{{ log.summaryString() }}</p>
              </ion-card-content>
            </ion-card>
          </div>
            
        </div>
        
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
  transition: all .4s ease;
  top: 0;
  left: 0;
  z-index: -1;
}

</style>