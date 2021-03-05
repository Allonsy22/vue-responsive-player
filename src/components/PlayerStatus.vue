<template>
  <div class="status-container">
    <v-card mx-auto flat>
      <div class="slider-container">
        <v-slider 
          v-model="timing"
          :disabled="!duration"
          :max="duration"
          min="0"
          :label="durationStatus"
          inverse-label
          dense
          hide-details
          color="orange"
          :style="{'width': '100%'}"
          class="mx-2"
          @change="setTrackTime"
        ></v-slider>

        <v-slider
          v-model="volume"
          :prepend-icon="isMute ? icons.mdiVolumeOff : icons.mdiVolumeHigh"
          color="blue"
          class="mx-2"
          dense
          hide-details
          max="100"
          min="0"
          :style="{'width': '70%'}"
          @input="setVolume"
          @click:prepend="isMute ? unmute() : mute()"
        ></v-slider>
      </div>
    </v-card>
  </div>
</template>
 
<script>
import { mdiVolumeHigh, mdiVolumeOff  } from '@mdi/js';
import { mapGetters } from 'vuex';

export default {
  name: 'PlayerStatus',
  
  data: () => ({
    icons: {
      mdiVolumeHigh,
      mdiVolumeOff,
    },
    timing: 0,
    volume: 50,
    isMute: false,
    interval: null,
  }),

  mounted() {
    this.interval = setInterval(() => {
      this.timing = this.time;
    }, 1000);
  },

  unmounted() {
    clearInterval(this.interval);
  },

  computed: {
    ...mapGetters([
      'duration',
      'time',
    ]),
    durationStatus() {
      const minutes = Math.floor(this.time / 60);
      const seconds = Math.floor(this.time % 60);
      const modifiedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${minutes}:${modifiedSeconds}`;
    }
  },

  methods: {
    setVolume() {
      if (this.volume === 0) this.isMute = true;
      if (this.volume > 0) this.isMute = false;
      this.$store.dispatch('setVolume', this.volume);
    },
    setTrackTime() {
      this.$store.dispatch('pickTrackTiming', this.timing);
      if (this.timing >= this.duration) this.timing = 0;
    },
    mute() {
      this.isMute = true;
      this.$store.dispatch('setVolume', 0);
    },
    unmute() {
      if (this.volume <= 0) this.volume = 100;
      this.isMute = false;
      this.$store.dispatch('setVolume', this.volume);
    }
  },
};
</script>
 
<style scoped>
.status-container {
  width: 100%;
}

.slider-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
}

</style>