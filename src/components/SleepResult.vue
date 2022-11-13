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
    IonTextarea,
    modalController,
} from '@ionic/vue';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import { useSettingsStore } from '@/stores/settings';

export default defineComponent({
    name: 'SleepResult',
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonTextarea },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore
        }
    },
    data() {
        return {
            story: "",
        }
    },
    props: {
        sleepObject: {
            type: OvernightSleepData,
            required: true
        }
    },
    methods: {
        cancel() {
            return modalController.dismiss(null, 'cancel');
        },
        confirm() {
            this.sleepObject.setJournal(this.story);
            this.settingsStore.addOvernightSleepData(this.sleepObject);
            return modalController.dismiss(null, 'confirm');
        },
    },
});
</script>


<template>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title class="ion-text-center">Sleep Result</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="confirm">Confirm</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h2>Sleep Journal</h2>
        <ion-item>
            <ion-textarea v-model="story" placeholder="How was your sleep?" :autoGrow="true"></ion-textarea>
        </ion-item>
    </ion-content>
</template>