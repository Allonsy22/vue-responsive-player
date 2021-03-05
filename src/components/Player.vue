<template>
  <div 
    class="player-container"
    :style="{'flex-direction': $vuetify.breakpoint.xs ? 'column' : 'row'}"
  >
    <PlayerCard/>
    <PlayerList/>
  </div>
</template>
 
<script>
import PlayerCard from '@/components/PlayerCard';
import PlayerList from '@/components/PlayerList';

export default {
  name: 'Player',

  components: {
    PlayerCard,
    PlayerList,
  },
 
};
</script>
 
<style scoped>
.player-container {
  width: 80%;
  display: flex;
  margin: 30px auto;
  align-items: center;
  justify-content: center;
}
</style>