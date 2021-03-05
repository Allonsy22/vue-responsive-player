<template>
  <v-app>
    <v-main>
      <Player/>
    </v-main>
  </v-app>
</template>

<script>
import Player from '@/components/Player';

export default {
  name: 'App',

  components: {
    Player,
  },

  data: () => ({
    //
  }),
};
</script>
