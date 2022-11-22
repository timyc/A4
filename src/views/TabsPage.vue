<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import Tutorial from '@/components/Tutorial.vue';
import { useSettingsStore } from '@/stores/settings';
import { moonOutline, sunnyOutline, listOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet, Tutorial },
  setup() {
    const settingsStore = useSettingsStore();
    return {
      moonOutline, 
      sunnyOutline, 
      listOutline,
      settingsStore
    }
  }
});
</script>

<template>
  <Tutorial v-if="settingsStore.isNew" />
  <ion-page v-else>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tab1">
          <ion-icon :icon="moonOutline" />
          <ion-label>Sleep</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/tab2">
          <ion-icon :icon="sunnyOutline" />
          <ion-label>Sleepiness</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/tab3">
          <ion-icon :icon="listOutline" />
          <ion-label>Logs</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
