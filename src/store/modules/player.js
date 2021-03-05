import { Howl, Howler } from 'howler';
import sounds from '../../utils/music';

const length = sounds.length;

const state = {
  sounds,
  currentSound: sounds[0].sound,
  currentSoundIndex: 0,
  maxSoundIndex: length - 1,
  currentAuthor: sounds[0].author,
  currentName: sounds[0].name,
  currentDuration: null,
  currentSoundTiming: 0,
  isPlay: false,
  isReady: true,
  isRepeat: false,
  isShuffle: false,
  soundInterval: null,
  howl: null,
  Howler,
};

const mutations = {
  SOUND_IS_PLAY(state, payload) {
    state.isPlay = payload;
  },
  SOUND_IS_END(state, payload) {
    state.isEnd = payload;
  },
  CHANGE_SOUND_OPTIONS( state, payload) {
    state.currentSoundIndex = payload;
    state.currentAuthor = sounds[payload].author;
    state.currentName = sounds[payload].name;
    state.currentSound = sounds[payload].sound;
    state.currentSoundTiming = 0;
  },
  DELETE_HOWL(state) {
    state.howl = null;
  },
  SET_VOLUME(state, payload) {
    state.Howler.volume(payload);
  },
  SET_DURATION(state, payload) {
    state.currentDuration = payload;
  },
  SET_SOUND_TIMING(state, payload) {
    state.currentSoundTiming = payload;
  },
  SET_READY_STATUS(state, payload) {
    state.isReady = payload;
  },
  SET_REPEAT_STATUS(state, payload) {
    state.isRepeat = payload;
  },
  SET_SHUFFLE_STATUS(state, payload) {
    state.isShuffle = payload;
  },
};

const actions = {
  play({ dispatch, commit, state }) {
    dispatch('clearSoundInterval');

    if ( state.howl === null) {
      state.howl = new Howl({
        src: [state.currentSound],
        onload: () => dispatch('setDuration'),
        onend: () => {
          if (state.isRepeat) {
            commit('SET_SOUND_TIMING', 0);
            dispatch('stop');
            dispatch('play');
            return;
          }

          dispatch('skipForward');
        },
        onplay: () => {
          dispatch('setTiming');
          setTimeout(() => {
            commit('SET_READY_STATUS', true);
          }, 500);
        },
        onpause: () => dispatch('clearSoundInterval'),
        onstop: () => commit('SET_READY_STATUS', false),
      });
    }

    state.howl.play();
    commit('SOUND_IS_PLAY', true);
  },

  pause({ commit, state }) {
    if (!state.howl) return;
    state.howl.pause();
    commit('SOUND_IS_PLAY', false);
  },

  stop({ commit, state }) {
    if (state.howl === null) return;
    state.howl.stop();
    commit('DELETE_HOWL');
  },

  skipBackward({ dispatch, commit, state }) {
    dispatch('stop');

    if (state.isShuffle) {
      dispatch('shuffle');
      dispatch('play');
      return;
    }

    const currentIndex = state.currentSoundIndex;
    if ( currentIndex <= 0 ) {
      commit('CHANGE_SOUND_OPTIONS', 0);
      dispatch('play');
      return;
    } else {
      commit('CHANGE_SOUND_OPTIONS', currentIndex - 1);
      dispatch('play');
    }
  },

  skipForward({ dispatch, commit, state }) {
    dispatch('stop');

    if (state.isShuffle) {
      dispatch('shuffle');
      dispatch('play');
      return;
    }

    const currentIndex = state.currentSoundIndex;
    if ( currentIndex >= state.maxSoundIndex ) {
      commit('CHANGE_SOUND_OPTIONS', 0);
      dispatch('play');
    } else {
      commit('CHANGE_SOUND_OPTIONS', currentIndex + 1);
      dispatch('play');
    }
  },

  pickSound({ dispatch, commit }, soundIndex) {
    dispatch('stop');
    commit('CHANGE_SOUND_OPTIONS', soundIndex);
    dispatch('play');
  },

  setVolume({ commit }, volume) {
    // volume range (0, 100), howler.volume range (0, 1);
    commit('SET_VOLUME', volume / 100);
  },

  async setDuration( { commit }) {
    // measuring duration in seconds
    const duration = await state.howl.duration();
    const roundedDuration = Math.round(duration * 100) / 100;
    commit('SET_DURATION', roundedDuration);
  },

  pickTrackTiming({ dispatch, commit, state }, time) {
    // time in seconds
    if ( state.howl === null ) return;
    if (time >= state.currentDuration && !state.isRepeat) {
      dispatch('skipForward');
      return;
    }
    commit('SET_SOUND_TIMING', time);
    state.howl.seek(time);
  },

  setTiming({ dispatch, commit, state }) {
    if (state.soundInterval !== null) return;
    state.soundInterval = setInterval(() => {
      commit('SET_SOUND_TIMING', state.currentSoundTiming + 1);
    }, 1000);
    if ( state.currentSoundTiming >= state.currentDuration) {
      dispatch('clearSoundInterval');
    }
  },

  clearSoundInterval({state}) {
    clearInterval(state.soundInterval);
    state.soundInterval = null;
  },

  toggleRepeat({dispatch, commit, state}) {
    commit('SET_REPEAT_STATUS', !state.isRepeat);
    if (state.isShuffle && state.isRepeat) dispatch('toggleShuffle');
  },

  toggleShuffle({ dispatch, commit, state }) {
    commit('SET_SHUFFLE_STATUS', !state.isShuffle);
    if (state.isRepeat && state.isShuffle) dispatch('toggleRepeat');
  },

  shuffle({commit, state}) {
    const index = Math.floor(Math.random() * state.maxSoundIndex);
    commit('CHANGE_SOUND_OPTIONS', index);
  },
};

const getters = {
  sounds: state => state.sounds,
  currentSound: state => state.currentSound,
  isPlay: state => state.isPlay,
  isReady: state => state.isReady,
  isRepeat: state => state.isRepeat,
  isShuffle: state => state.isShuffle,
  author: state => state.currentAuthor,
  currentIndex: state => state.currentSoundIndex,
  name: state => state.currentName,
  duration: state => state.currentDuration,
  time: state => state.currentSoundTiming,
};

const playerModule = {
  state,
  mutations,
  actions,
  getters,
};

export default playerModule;