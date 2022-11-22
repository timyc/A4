<script lang="ts">
import { defineComponent } from 'vue';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonIcon,
    modalController,
} from '@ionic/vue';
import { logoFacebook,logoTwitter } from 'ionicons/icons';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import { useSettingsStore } from '@/stores/settings';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';

export default defineComponent({
    name: 'LogInfo',
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonIcon },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore, logoFacebook,logoTwitter
        }
    },
    data() {
        return {
            type: 0, // 0 = sleep, 1 = sleepiness
        }
    },
    props: {
        sleepObject: {
            required: true
        }
    },
    methods: {
        cancel() {
            return modalController.dismiss(null, 'cancel');
        },
        delte() { // misspelled on purpose
            if (this.type == 1) {
                this.settingsStore.deleteOvernightSleepData(this.sleepObject as OvernightSleepData);
            } else if (this.type == 2) {
                this.settingsStore.deleteStanfordSleepData(this.sleepObject as StanfordSleepinessData);
            }
            return modalController.dismiss(null, 'delete');
        },
    },
    mounted() {
        if (this.sleepObject instanceof OvernightSleepData) {
            this.type = 1;
        } else if (this.sleepObject instanceof StanfordSleepinessData) {
            this.type = 2;
        }
    }
});
</script>


<template>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button @click="cancel">Close</ion-button>
            </ion-buttons>
            <ion-title class="ion-text-center">Log Info</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="delte" style="color:red">Delete</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h2>{{ (sleepObject as any).dateString() }}</h2>
        <span>{{ (sleepObject as any).summaryString() }}</span>
        <ion-item v-if="(sleepObject as any).getJournal() != ''" style="white-space: pre-wrap;padding: 10px">
            {{ (sleepObject as any).getJournal() }}
        </ion-item>
        <ion-button expand="block" color="tertiary">
            <ion-icon slot="start" :icon="logoFacebook"></ion-icon>
            Share to Facebook
        </ion-button>
        <ion-button expand="block" color="secondary">
            <ion-icon slot="start" :icon="logoTwitter"></ion-icon>
            Share to Twitter
        </ion-button>
    </ion-content>
</template>