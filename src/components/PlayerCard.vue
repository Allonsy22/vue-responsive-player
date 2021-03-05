<template>
  <div 
    :style="{'width': $vuetify.breakpoint.xs ? '100%' : '40%'}"
  >
    <v-card 
      class="mx-auto" 
      max-height="400" 
      height="400"
    >
      <v-col justify="center" align="center">
        <h3 class="mb-3">{{cuttedName}}</h3>

        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="200px"
          width="200"
        ></v-img>
      </v-col>

      <v-card-actions class="card-action">
        <!--repeat button-->
        <v-btn 
          @click="toggleRepeat"
          x-small
          text
          :color="isRepeat ? 'orange' : 'black'"
        >
          <v-icon size="20">
            {{ icons.mdiRepeat }}
          </v-icon>
        </v-btn>
        <!--backward button-->
        <v-btn 
          @click="skipBackward"
          x-small
          text
          :disabled="!isReady"
        >
          <v-icon size="20">
            {{ icons.mdiSkipBackward }}
          </v-icon>
        </v-btn>
        <!--play/pause button-->
        <v-btn 
          @click="!isPlay ? play() : pause()"
          x-small
          text
          :disabled="!isReady"
        >
          <v-icon size="20">
            {{ isPlay ? icons.mdiPause : icons.mdiPlay }}
          </v-icon>
        </v-btn>
        <!--forward button-->
        <v-btn 
          @click="skipForward"
          x-small
          text
          :disabled="!isReady"
        >
          <v-icon size="20">
            {{ icons.mdiSkipForward }}
          </v-icon>
        </v-btn>
        <!--shuffle button-->
        <v-btn 
          @click="toggleShuffle"
          x-small
          text
          :color="isShuffle ? 'orange' : 'black'"
        >
          <v-icon size="20">
            {{ icons.mdiShuffleVariant }}
          </v-icon>
        </v-btn>
      </v-card-actions>

      <PlayerStatus/>
    </v-card>
  </div>
</template>
 
<script>
import {
  mdiRepeat,
  mdiSkipBackward,
  mdiPlay,
  mdiSkipForward,
  mdiShuffleVariant,
  mdiPause,
} from "@mdi/js";
import { mapGetters,  mapActions } from 'vuex';
import PlayerStatus from '@/components/PlayerStatus';

export default {
  name: "PlayerCard",

  components: {
    PlayerStatus,
  },

  data() {
    return {
      icons: {
        mdiRepeat,
        mdiSkipBackward,
        mdiPlay,
        mdiSkipForward,
        mdiShuffleVariant,
        mdiPause,
      },
    }
  },

  computed: {
    ...mapGetters([
      'currentSound',
      'isPlay',
      'isReady',
      'isRepeat',
      'isShuffle',
      'author',
      'name',
    ]),
    cuttedName() {
      if (this.name.length <= 40) return this.name;
      return `${this.name.slice(0, 39)}...`;
    },
  },

  methods: {
    ...mapActions([
      'play',
      'pause',
      'skipBackward',
      'skipForward',
      'toggleRepeat',
      'toggleShuffle',
    ]),
  },
};
</script>
 
<style scoped>
.card-action {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>