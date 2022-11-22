<script lang="ts">
import { defineComponent, ref } from 'vue';
import "vue3-circle-progress/dist/circle-progress.css";
import { useSettingsStore } from '@/stores/settings';
import { settingsOutline } from 'ionicons/icons';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import { differenceInSeconds } from 'date-fns';
import CircleProgress from 'vue3-circle-progress';
import LogInfo from '@/components/LogInfo.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToast, modalController } from '@ionic/vue';
import SleepSettings from '@/components/SleepSettings.vue';
import SleepResult from '@/components/SleepResult.vue';

export default defineComponent({
  name: 'Tab1Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, CircleProgress, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToast },
  setup() {
    const settingsStore = useSettingsStore();
    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => isOpenRef.value = state;
    return {
      settingsStore, settingsOutline, setOpen, isOpenRef
    }
  },
  data() {
    return {
      state: 0,
      seconds: 0,
      healthScore: 0,
      goal: 10,
      data: {},
      timer: undefined as unknown as number,
      startTime: undefined as unknown as Date,
      endTime: undefined as unknown as Date,
      scrollPosition: null as unknown as number,
    }
  },
  mounted() {
    if (this.settingsStore.sleepType == 0) {
      this.goal = this.settingsStore.sleepTime;
    } else {
      this.goal = this.settingsStore.sleepTime;
    }
    
    this.updateHealthScore();
  },
  methods: {
    incrementTimer() {
      this.timer = setInterval(() => {
        this.seconds++;
      }, 1000);
    },
    updateHealthScore() {
      if (this.settingsStore.overnightSleepData.length == 0) {
        this.healthScore = 100;
        return;
      }
      this.healthScore = this.settingsStore.overnightSleepData.slice(0, 7).reduce((a, b) => a + b.sleepTime(), 0) / 7;
      if (this.settingsStore.age < 18) {
        this.healthScore = (this.healthScore / 252000) * 100;
      }
      else if (this.settingsStore.age < 65) {
        this.healthScore = (this.healthScore / 201600) * 100;
      }
      else {
        this.healthScore = (this.healthScore / 151200) * 100;
      }
    },
    formatTime(sec: number): string {
      let hours = Math.floor(sec / 3600);
      let minutes = Math.floor((sec - (hours * 3600)) / 60);
      let seconds = sec - (hours * 3600) - (minutes * 60);
      return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    },

    startSleep() {
      if (this.settingsStore.sleepType == 1) {
          const wakeTime = (this.data as any).wakeTime.split(":");
          const nd = new Date(); // now
          const nd2 = new Date();
          nd2.setHours(Number(wakeTime[0]), Number(wakeTime[1]), 0, 0);
          if (nd > nd2) {
            nd2.setDate(nd2.getDate() + 1);
            this.goal = differenceInSeconds(nd2, nd);
          }
          else {
            this.goal = differenceInSeconds(nd2, nd);
          }
          console.log("Goal:",this.goal);
        }
      this.startTime = new Date();
      this.state = 1;
      this.incrementTimer();
    },
    async stopSleep() {
      this.endTime = new Date();
      const sleepData = new OvernightSleepData(this.startTime, this.endTime);
      //this.settingsStore.addOvernightSleepData(data);
      const modal = await modalController.create({
        component: SleepResult,
        componentProps: {
          sleepObject: sleepData
        }
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      data;
      if (role === 'confirm') {
        this.updateHealthScore();
      }
      this.state = 0;
      this.seconds = 0;
      clearInterval(this.timer);
    },
    async showLog(sleepData: any) {
      const modal = await modalController.create({
        component: LogInfo,
        componentProps: {
          sleepObject: sleepData
        }
      });
      modal.present();
    },
    handleScroll(ev: CustomEvent) {
      this.scrollPosition = ev.detail.scrollTop;
    },
    async openModal() {
      const modal = await modalController.create({
        component: SleepSettings,
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
        this.data = data;
        this.settingsStore.age = data.age;
        this.settingsStore.sleepTime = data.sleepyTime;
        this.goal = this.settingsStore.sleepTime;
        this.state = 0;
      }
    },
  },
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button @click="openModal">
            <ion-icon slot="icon-only" :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ seconds > 0 ? `Sleeping for ${formatTime(seconds)}` : `Sleep Tracker` }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <div :class="['unsplash', { 'visible': scrollPosition > 50 }]"></div>
    <div :class="['splash', { 'invisible': scrollPosition > 50 }]"></div>
    <ion-content :scroll-events="true" @ionScroll="handleScroll($event)">
      <div class="container">
        <div style="height:90%" v-if="state == 1">Good Night</div>
        <div style="height:90%" v-else>Health Score: {{ healthScore.toFixed(2) }}</div>
        <circle-progress class="p-absolute" :size="210" fill-color="#9145B6" empty-color="rgba(63, 59, 108, 0.85)"
          :percent="healthScore" />
        <circle-progress class="p-absolute" :is-bg-shadow="true" fill-color="#ffffff"
          empty-color="rgba(63, 59, 108, 0.7)" :percent="seconds < goal ? ~~((seconds / goal) * 100) : 100" />
        <ion-button shape="round" fill="outline" v-if="state == 0" @click="startSleep">Start</ion-button>
        <ion-button color="danger" shape="round" fill="outline" v-if="state == 1" @click="stopSleep">Stop</ion-button>
        <div class="p-absolute" style="top:60vh">
          <div style="flex-direction: column;" v-if="settingsStore.overnightSleepData.length > 0">
            <h2 class="heading" style="max-width:140px">Recent Logs</h2>
            <ion-card v-for="log, index in settingsStore.overnightSleepData.slice(0, 3)" :key="index">
              <ion-card-header @click="showLog(log)">
                <ion-card-title style="color:royalblue">{{ log.dateString() }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p class="log-preview">{{ log.getJournal() }}</p>
                <div>{{ log.summaryString() }}</div>
                <div class="d-flex j-end text-danger" @click="settingsStore.deleteOvernightSleepData(log as any); setOpen(true);updateHealthScore()">Delete</div>
              </ion-card-content>
            </ion-card>
          </div>

        </div>

      </div>
    </ion-content>
    <ion-toast :is-open="isOpenRef" @didDismiss="setOpen(false)" :duration="5000"
      :buttons="[{
              text: 'Undo Delete',
              role: 'cancel',
              handler: () => { settingsStore.restoreOvernightSleepData();updateHealthScore() }
            },{
              text: 'Dismiss',
            }]"></ion-toast>
  </ion-page>
</template>

<style scoped>
ion-button[shape="round"] {
  --border-radius: 50%;
  height: 150px;
  width: 150px;
  position: absolute;
}

.unsplash {
  height: 100%;
  width: 100%;
  position: absolute;
  background: linear-gradient(#100720, #16213E);
  transition: all .8s ease;
  opacity: 0;
}

.splash {
  background-image: url('@/assets/nightfade.png');
  background-size: 100vw 40vh;
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