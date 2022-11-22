<script lang="ts">
import { defineComponent, reactive,ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import LogInfo from '@/components/LogInfo.vue';
import { trashOutline } from 'ionicons/icons';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, modalController, alertController, IonButtons, IonButton, IonIcon } from '@ionic/vue';

export default defineComponent({
  name: 'Tab3Page',
  setup() {
    const items: any = reactive([]);
    const settingsStore = useSettingsStore();
    const selected = ref("1");
    const generateItems = () => {
      //console.log(selected);
      const count = items.length;
      for (let i = count; i < count + 5; i++) {
        if (selected.value == "1") {
          if (items.length > settingsStore.sleepData.length - 1) {
            break;
          }
          items.push(settingsStore.sleepData[i]);
        } else if (selected.value == "2") {
          if (items.length > settingsStore.overnightSleepData.length - 1) {
            break;
          }
          items.push(settingsStore.overnightSleepData[i]);
        } else {
          if (items.length > settingsStore.stanfordSleepinessData.length - 1) {
            break;
          }
          items.push(settingsStore.stanfordSleepinessData[i]);
        }

      }
    };

    const ionInfinite = (ev: any) => {
      generateItems();
      setTimeout(() => ev.target.complete(), 500);
    };
    //generateItems();
    return { ionInfinite, items, generateItems, selected, trashOutline, settingsStore };
  },
  mounted() {
    this.generateItems();
  },
  updated() {
    this.refresh({detail: {value: "1"}}); // refresh the list when the page is updated
  },
  methods: {
    refresh(e: any) {
      this.selected = e.detail.value;
      this.items.length = 0;
      this.generateItems();
    },
    async showLog(sleepData: any) {
      const modal = await modalController.create({
        component: LogInfo,
        componentProps: {
          sleepObject: sleepData
        }
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      data;
      if (role === 'delete') {
        this.items.length = 0;
        this.generateItems();
      }
    },
    async confirmDelete() {
      const alert = await alertController.create({
          header: 'Are you sure you want to delete all data? This action is irreversible!',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                this.settingsStore.overnightSleepData.length = 0;
                this.settingsStore.sleepData.length = 0;
                this.settingsStore.stanfordSleepinessData.length = 0;
                this.refresh({detail: {value: "1"}});
              },
            },
          ],
        });

        await alert.present();
    },
  },
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSelect, IonSelectOption, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButtons, IonButton, IonIcon },
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button @click="confirmDelete">
            <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>View Logs and Entries</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-select :value="selected" @ionChange="(e) => { refresh(e) }">
        <ion-select-option value="1">All Logs and Entries</ion-select-option>
        <ion-select-option value="2">Sleep Tracker Logs</ion-select-option>
        <ion-select-option value="3">Sleepiness Entries</ion-select-option>
      </ion-select>
      <ion-list>
        <ion-item v-for="item, index in items" :key="index" @click="() => showLog(item)">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ item.dateString() }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ item.getJournal() }}</p>
              <div>{{ item.summaryString() }}</div>
            </ion-card-content>
          </ion-card>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>