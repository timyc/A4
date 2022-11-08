<script lang="ts">
import { defineComponent } from 'vue';
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from 'vue3-circle-progress';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';

export default defineComponent({
  name: 'Tab1Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, CircleProgress },
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
      //this.sleepService.logOvernightData(new OvernightSleepData(this.startTime, this.endTime));
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
        <ion-title>{{ seconds > 0 ? `Sleeping for ${formatTime(seconds)}` : `Sleep Tracker` }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <div class="splash"></div>
    <ion-content>
      <div class="container">
        <circle-progress class="p-absolute" linecap="butt" :size="210" :is-gradient="true" :gradient="{angle: 45,startColor: '#051126',stopColor: '#4c3f77'}" :percent="60" />
        <circle-progress linecap="butt" :is-bg-shadow="true" :is-gradient="true" :gradient="{angle: 45,startColor: '#051126',stopColor: '#4c3f77'}" :percent="seconds < goal ? Math.floor((seconds/goal) * 100) : 100" />
        <ion-button shape="round" fill="outline" v-if="state == 0" @click="startSleep">Start</ion-button>
        <ion-button color="danger" shape="round" fill="outline" v-if="state == 1" @click="stopSleep">Stop</ion-button>
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