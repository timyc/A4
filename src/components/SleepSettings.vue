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
    IonLabel,
    IonInput,
    IonRow,
    IonCol,
    modalController,
} from '@ionic/vue';
import { useSettingsStore } from '@/stores/settings';

export default defineComponent({
    name: 'SleepSettings',
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonRow, IonCol },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore,
        }
    },
    data() {
        return {
            age: 0,
            hours: 0,
            minutes: 0,
        }
    },
    methods: {
        cancel() {
            return modalController.dismiss(null, 'cancel');
        },
        confirm() {
            return modalController.dismiss({"age":this.age,"sleepyTime":(this.hours * 3600) + (this.minutes * 60)}, 'confirm');
        },
    },
    mounted() {
        this.age = this.settingsStore.age;
        this.hours = Math.floor(this.settingsStore.sleepTime / 3600);
        this.minutes = Math.floor(this.settingsStore.sleepTime % 3600 / 60);
    },
});
</script>


<template>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title class="ion-text-center">Sleep Settings</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="confirm">Confirm</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <h2>Personal Info</h2>
        <ion-item>
            <ion-label position="stacked">Your age</ion-label>
            <ion-input type="number" v-model="age" :min="0" :placeholder="settingsStore.age.toString()"></ion-input>
        </ion-item>
        <h2>Sleeping Time</h2>
        <ion-row>
            <ion-col>
                <ion-item>
                    <ion-label position="stacked">Hours</ion-label>
                    <ion-input type="number" v-model="hours" :min="0"></ion-input>
                </ion-item>
            </ion-col>
            <ion-col>
                <ion-item>
                    <ion-label position="stacked">Minutes</ion-label>
                    <ion-input type="number" v-model="minutes" :min="0" :max="59"></ion-input>
                </ion-item>
            </ion-col>
        </ion-row>
    </ion-content>
</template>