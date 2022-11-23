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
    IonBadge,
    modalController,
} from '@ionic/vue';
import { callOutline,logoTwitter } from 'ionicons/icons';
import { OvernightSleepData } from '@/structs/overnight-sleep-data';
import { useSettingsStore } from '@/stores/settings';
import { StanfordSleepinessData } from '@/structs/stanford-sleepiness-data';
declare global {
  interface Window {
    Bridge: any;
  }
}
export default defineComponent({
    name: 'LogInfo',
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonIcon, IonBadge },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore, callOutline,logoTwitter
        }
    },
    data() {
        return {
            type: 0, // 1 = sleep, 2 = sleepiness
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
        shareTwitter() {
            if (window.Bridge) {
                if (this.type == 1) {
                    window.Bridge.postMessage(JSON.stringify({command: "tweet1"}));
                } else if (this.type == 2) {
                    window.Bridge.postMessage(JSON.stringify({command: "tweet2"}));
                }
            } else {
                if (this.type == 1) {
                    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent("I slept for " + (this.sleepObject as OvernightSleepData).summaryString()));
                } else if (this.type == 2) {
                    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent("My sleepiness was " + (this.sleepObject as StanfordSleepinessData).summaryString()));
                }
            }
        },
        shareContacts() {
            if (window.Bridge) {
                if (this.type == 1) {
                    window.Bridge.postMessage(JSON.stringify({command: "contact1"}));
                } else if (this.type == 2) {
                    window.Bridge.postMessage(JSON.stringify({command: "contact2"}));
                }
            } else {
                window.alert("Not supported on this platform");
            }
        }
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
        <div class="d-flex center" v-if="type == 1">
            <ion-badge color="danger" v-if="!(sleepObject as any).goalMet">Goal Unmet</ion-badge>
            <ion-badge color="success" v-else>Goal met</ion-badge>
        </div>
        <ion-item v-if="(sleepObject as any).getJournal() != ''" style="white-space: pre-wrap;padding: 10px">
            {{ (sleepObject as any).getJournal() }}
        </ion-item>
        <ion-button expand="block" color="secondary" @click="shareTwitter">
            <ion-icon slot="start" :icon="logoTwitter"></ion-icon>
            Share to Twitter
        </ion-button>
        <ion-button expand="block" color="tertiary" @click="shareContacts">
            <ion-icon slot="start" :icon="callOutline"></ion-icon>
            Share with Contacts
        </ion-button>
    </ion-content>
</template>