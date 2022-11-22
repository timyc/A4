<script lang="ts">
import { defineComponent } from 'vue';
import { format, parseISO } from 'date-fns';
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
    IonDatetime,
    IonIcon,
    modalController,
} from '@ionic/vue';
import { swapHorizontalOutline } from 'ionicons/icons';
import { useSettingsStore } from '@/stores/settings';

export default defineComponent({
    name: 'SleepSettings',
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonRow, IonCol, IonIcon, IonDatetime },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore, swapHorizontalOutline
        }
    },
    data() {
        return {
            age: 0,
            hours: 0,
            minutes: 0,
            sleepType: 0,
            wakeTime: '',
        }
    },
    methods: {
        cancel() {
            return modalController.dismiss(null, 'cancel');
        },
        confirm() {
            this.settingsStore.wakeUpString = this.wakeTime;
            return modalController.dismiss({"age":this.age,"sleepyTime":(this.hours * 3600) + (this.minutes * 60),"wakeTime":format(parseISO(this.wakeTime), 'HH:mm')}, 'confirm');
        },
        changeSleepType() {
            this.sleepType = (this.sleepType + 1) % 2;
            this.settingsStore.sleepType = this.sleepType;
            if (this.sleepType == 1) {
                this.settingsStore.wakeUpString = this.wakeTime;
            }
        }
    },
    mounted() {
        this.age = this.settingsStore.age;
        this.sleepType = this.settingsStore.sleepType;
        this.hours = Math.floor(this.settingsStore.sleepTime / 3600);
        this.minutes = Math.floor(this.settingsStore.sleepTime % 3600 / 60);
        this.wakeTime = this.settingsStore.wakeUpString != '' ? this.settingsStore.wakeUpString : new Date().toISOString();
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
        <h2 class="d-flex">Sleeping Time <ion-icon slot="icon-only" :icon="swapHorizontalOutline" @click="changeSleepType"></ion-icon></h2>
        <ion-row v-if="sleepType == 0">
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
        <ion-row v-if="sleepType == 1">
            <ion-col>
                <ion-item>
                    <ion-datetime v-model="wakeTime" :value="wakeTime" class="center d-flex w-100" presentation="time"></ion-datetime>
                </ion-item>
            </ion-col>
        </ion-row>
    </ion-content>
</template>