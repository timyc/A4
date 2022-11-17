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
    modalController,
} from '@ionic/vue';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import { useSettingsStore } from '@/stores/settings';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';

export default defineComponent({
    name: 'LogInfo',
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore
        }
    },
    data() {
        return {
            type: 0,
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
            <ion-title class="ion-text-center">Log Info</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="cancel">Close</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h2>{{ (sleepObject as any).dateString() }}</h2>
        <ion-item>
            
        </ion-item>
    </ion-content>
</template>