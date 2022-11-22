<script lang="ts">
import { defineComponent,ref } from 'vue';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';
import { useSettingsStore } from '@/stores/settings';
import LogInfo from '@/components/LogInfo.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSelect, IonSelectOption,IonTextarea,IonButton,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonToast,modalController,alertController } from '@ionic/vue';

export default defineComponent({
  name: 'Tab2Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItem, IonSelect, IonSelectOption,IonTextarea,IonButton,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonToast },
  setup() {
    const settingsStore = useSettingsStore();
    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => isOpenRef.value = state;
    return {
      settingsStore, StanfordSleepinessData,setOpen, isOpenRef
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
      if (this.sleepiness == 0) {
        const alert = await alertController.create({
          header: 'Error',
          message: 'Please select a sleepiness level.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
      const data = new StanfordSleepinessData(this.sleepiness, new Date(), this.story);
      this.settingsStore.addStanfordSleepinessData(data);
      this.sleepiness = 0;
      this.story = "";
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
    <div :class="['unsplash', { 'visible': scrollPosition > 30 }]"></div>
    <div :class="['splash', { 'invisible': scrollPosition > 30 }]"></div>
    <ion-content :scroll-events="true" @ionScroll="handleScroll($event)">
      <div class="container">
        <ion-list class="p-absolute">
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
          <ion-button color="warning" @click="submit">Submit</ion-button>
        </div>
        </ion-list>
        
        <div class="p-absolute" style="width:90vw;top:60vh">
          <h2 class="heading2" style="max-width:160px">Recent Entries</h2>
          <div style="color:darkslategray" v-if="settingsStore.stanfordSleepinessData.length == 0">Nothing here yet... get logging!</div>
          <div class="d-flex" style="flex-direction:column">
            <ion-card v-for="log, index in settingsStore.stanfordSleepinessData.slice(0, 2)" :key="index">
              <ion-card-header @click="showLog(log)">
                <ion-card-title style="color:royalblue">{{ log.dateString() }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p class="log-preview">{{ log.getJournal() }}</p>
                <div>{{ log.summaryString() }}</div>
                <div class="d-flex j-end text-danger" @click="settingsStore.deleteStanfordSleepData(log as any); setOpen(true)">Delete</div>
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
              handler: () => { settingsStore.restoreStanfordSleepData() }
            },{
              text: 'Dismiss',
            }]"></ion-toast>
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
ion-card-title {
  --color: black !important;
}
.splash {
  background-image: url('@/assets/yellowday.png');
  background-size: 100vw 35vh;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  transition: all .2s ease;
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