<template>
  <div 
    :style="{'width': $vuetify.breakpoint.xs ? '100%' : '60%'}"
  >
    <v-card class="mx-auto" max-height="400">
      <v-virtual-scroll 
        item-height="60" 
        height="340"
        :items="sounds"
      >
        <template v-slot:default="{item, index}">
          <v-list-item 
            two-line 
            :key="index" 
            :class="{'active': currentIndex === index}"
            @click="pickSound(index)"
          >
            <v-list-item-content>
              <v-list-item-title>{{item.name}}</v-list-item-title>
              <v-list-item-subtitle>{{item.author}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
      
      <div class="information-container">
        <div class="song-information">
          <p class="subtitle-2">{{cuttedName}}</p>
          <p class="text-caption">{{cuttedAuthorName}}</p>
        </div>
        <p class="mr-2">{{currentIndex + 1}} / {{sounds.length}}</p>
      </div>
    </v-card>
  </div>
</template>
 
<script>
import { mapGetters } from 'vuex';

export default {
  name: "PlayerList",

  computed: {
    ...mapGetters([
      'sounds',
      'currentIndex',
      'name',
      'author'
    ]),
    cuttedName() {
      if (this.name.length <= 30) return this.name;
      return `${this.name.slice(0, 29)}...`;
    },
    cuttedAuthorName() {
      if (this.author.length <= 30) return this.author;
      return `${this.author.slice(0, 29)}...`;
    }
  },

  methods: {
    pickSound(soundIndex) {
      this.$store.dispatch('pickSound', soundIndex);
    },
  },

};
</script>
 
<style scoped>
.active {
  background-color: orange;
}

.song-information {
  margin-left: 10px;
}

.song-information p {
  margin: 0;
}

.information-container {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>