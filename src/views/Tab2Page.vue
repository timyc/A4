<script lang="ts">
import { defineComponent } from 'vue';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';
import { useSettingsStore } from '@/stores/settings';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSelect, IonSelectOption,IonTextarea,IonButton } from '@ionic/vue';

export default defineComponent({
  name: 'Tab2Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItem, IonSelect, IonSelectOption,IonTextarea,IonButton },
  setup() {
    const settingsStore = useSettingsStore();
    return {
      settingsStore, StanfordSleepinessData
    }
  },
  data() {
    return {
      scrollPosition: null as unknown as number,
      sleepiness: 0,
      story: "",
    }
  },
  methods: {
    handleScroll(ev: CustomEvent) {
      this.scrollPosition = ev.detail.scrollTop;
    },
    async submit() {
      const data = new StanfordSleepinessData(this.sleepiness, new Date(), this.story);
      this.settingsStore.addStanfordSleepinessData(data);
      this.sleepiness = 0;
      this.story = "";
    }
  }
});
</script>

<template>
  <ion-page style="background:lightgoldenrodyellow">
    <ion-header>
      <ion-toolbar>
        <ion-title>Sleepiness Logger</ion-title>
      </ion-toolbar>
    </ion-header>
    <div :class="['unsplash', { 'visible': scrollPosition > 50 }]"></div>
    <div :class="['splash', { 'invisible': scrollPosition > 50 }]"></div>
    <ion-content :scroll-events="true" @ionScroll="handleScroll($event)">
      <div class="container" style="margin-top:150px">
        <ion-list>
          <h2>Sleepiness</h2>
          <ion-item>
            <ion-select v-model="sleepiness" style="text-overflow:ellipsis;max-width:80vw" interface="action-sheet" placeholder="Select your level of sleepiness">
              <ion-select-option v-for="item,index in StanfordSleepinessData.ScaleValues" :value="index" :key="index">{{ item }}</ion-select-option>
            </ion-select>
          </ion-item>
          <h2>Other info</h2>
          <ion-item>
            <ion-textarea v-model="story" placeholder="Any other thoughts?" :autoGrow="true"></ion-textarea>
        </ion-item>
        <div class="d-flex center">
          <ion-button @click="submit">Submit</ion-button>
        </div>
        <div style="width:90vw">
          <h2 class="heading" style="max-width:140px">Recent Logs</h2>
          <div class="d-flex" style="flex-direction:row">
            <ion-card style="max-width:50%" v-for="log, index in settingsStore.stanfordSleepinessData.slice(0, 2)" :key="index">
              <ion-card-header>
                <ion-card-title>{{ log.dateString() }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>{{ log.getJournal() }}</p>
                <div>{{ log.summaryString() }}</div>
                <div class="d-flex j-end text-danger" @click="settingsStore.deleteOvernightSleepData(log as any)">Delete</div>
              </ion-card-content>
            </ion-card>
          </div>
          
        </div>
        
        
        </ion-list>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
h2 {
  color: black;
}
.list-md {
  background: lightgoldenrodyellow !important;
}
ion-item {
  --background: lightgoldenrodyellow !important;
  --color: black !important;
}
.splash {
  background-image: url('@/assets/yellowday.png');
  background-size: 100vw 35vh;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  transition: all .4s ease;
  top: 0;
  left: 0;
  z-index: -1;
}

.unsplash {
  height: 100%;
  width: 100%;
  position: absolute;
  background: lightgoldenrodyellow;
  transition: all .8s ease;
  opacity: 0;
}
</style>