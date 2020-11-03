import { createStore } from 'vuex'

const store = createStore({
  state: {
    aidl: {
      // Character name
      name: 'Noob',

      // Level and stats
      level: 1,
      experience: [0, 100],
      health: [100, 100],
      stamina: [100, 100]
    }
  },
  mutations: {
    gainExperience (state, experience) {
      state.aidl.experience[0] += experience;
      if (state.aidl.experience[0] >= state.aidl.experience[1])
      {
        state.aidl.level++;
        state.aidl.experience[0] = state.aidl.experience[0] - state.aidl.experience[1];
        state.aidl.experience[1] = state.aidl.experience[1] * 1.05 ^ state.aidl.level;
      }
    }
  }
});

export default store;