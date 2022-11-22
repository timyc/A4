<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { IonSlides, IonSlide, IonContent, IonButton, IonIcon, IonImg } from '@ionic/vue';
export default defineComponent({
    name: 'Tutorial',
    components: { IonSlides, IonSlide, IonContent, IonButton, IonIcon, IonImg },
    setup() {
        const settingsStore = useSettingsStore();
        return {
            settingsStore
        }
    },
    data() {
        return {
            slideOpts: {
                initialSlide: 0,
                speed: 500
            }
        }
    },
    methods: {
        async start() {
            this.settingsStore.isNew = false;
        }
    }
});
</script>
<template>
    <ion-content fullscreen :scrolly="false">
        <ion-slides :pager="true" :options="slideOpts">
            <ion-slide>
                <h1>Thanks for installing SleepTracker</h1>
                <ul>
                    <li>Track your sleep health</li>
                    <li>Journal your sleepiness</li>
                    <li>Share with your friends</li>
                </ul>
                <em>Swipe left to learn about configurations</em>
            </ion-slide>
            <ion-slide>
                <h2>Click the top right to access user settings. By default, you are an 18 year old.</h2>
                <ion-img :src="require('@/assets/Screenshot_43.png')"></ion-img>
                <ion-button @click="() => start()">
                    Let's go!
                </ion-button>
            </ion-slide>
        </ion-slides>
    </ion-content>
</template>

<style scoped>
ion-slides {
    height: 100vh;
}
ion-slide {
    flex-direction:column;
}
</style>